import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { requireNativeModule } from "expo-modules-core";
import { PermissionsAndroid, Platform } from "react-native";

import { getStoredUser, type BackendReport } from "@/lib/api";

const GUEST_SENDER_CODE_KEY = "resq_guest_sender_code";

type SmsConfig = {
  resqSmsEnabled?: boolean | string;
  resqSmsFallbackNumber?: string;
};

type NativeSmsModule = {
  isAvailableAsync(): Promise<boolean>;
  sendTextMessageAsync(phoneNumber: string, message: string): Promise<boolean>;
};

type SmsPayloadInput = {
  disasterType: string;
  latitude: number;
  longitude: number;
  barangay: string;
  senderCode: string;
  clientReportId: string;
};

let nativeSmsModule: NativeSmsModule | null = null;

try {
  nativeSmsModule = requireNativeModule<NativeSmsModule>("ResqSms");
} catch {
  nativeSmsModule = null;
}

function getSmsConfig() {
  return (Constants.expoConfig?.extra as SmsConfig | undefined) ?? {};
}

function isSmsEnabledFlag(value: SmsConfig["resqSmsEnabled"]) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  return false;
}

function createRandomSuffix() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function ensureSmsPermission() {
  if (Platform.OS !== "android") {
    throw new Error("Silent SMS fallback is available only on Android APK/dev builds.");
  }

  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS, {
    title: "Allow ResQ to send offline SMS reports",
    message: "ResQ needs SMS permission so it can send emergency fallback reports when the API is unreachable.",
    buttonPositive: "Allow",
    buttonNegative: "Not now",
  });

  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new Error("SMS permission was denied.");
  }
}

export function createClientReportId() {
  return `report_${createRandomSuffix()}`;
}

export async function getSmsSenderCode() {
  const storedUser = await getStoredUser();
  if (storedUser?.id) {
    return `user_${storedUser.id}`;
  }

  const existingGuestCode = await AsyncStorage.getItem(GUEST_SENDER_CODE_KEY);
  if (existingGuestCode) {
    return existingGuestCode;
  }

  const nextGuestCode = `guest_${createRandomSuffix()}`;
  await AsyncStorage.setItem(GUEST_SENDER_CODE_KEY, nextGuestCode);
  return nextGuestCode;
}

export function buildSmsPayload({
  disasterType,
  latitude,
  longitude,
  barangay,
  senderCode,
  clientReportId,
}: SmsPayloadInput) {
  return [
    disasterType.toUpperCase(),
    senderCode,
    latitude.toFixed(6),
    longitude.toFixed(6),
    barangay || "Unknown area",
    clientReportId,
  ].join("|");
}

export async function sendFallbackSms(payload: SmsPayloadInput) {
  const { resqSmsFallbackNumber, resqSmsEnabled } = getSmsConfig();

  if (!isSmsEnabledFlag(resqSmsEnabled)) {
    throw new Error("SMS fallback is disabled in app.json.");
  }

  const phoneNumber = resqSmsFallbackNumber?.trim();
  if (!phoneNumber) {
    throw new Error("Missing expo.extra.resqSmsFallbackNumber in app.json.");
  }

  if (!nativeSmsModule || !(await nativeSmsModule.isAvailableAsync())) {
    throw new Error("The Android SMS sender module is not available in this build.");
  }

  await ensureSmsPermission();

  const message = buildSmsPayload(payload);
  const sent = await nativeSmsModule.sendTextMessageAsync(phoneNumber, message);

  if (!sent) {
    throw new Error("SMS fallback could not be sent.");
  }

  return { phoneNumber, message };
}

export async function buildLocalSmsReport(
  payload: Omit<SmsPayloadInput, "senderCode"> & { senderCode: string; disasterLabel?: string },
) {
  const storedUser = await getStoredUser();
  const isoNow = new Date().toISOString();

  return {
    id: -Date.now(),
    user_id: storedUser?.id ?? null,
    sms_sender_code: payload.senderCode,
    client_report_id: payload.clientReportId,
    disaster_type: payload.disasterType,
    latitude: payload.latitude,
    longitude: payload.longitude,
    barangay: payload.barangay || "Unknown area",
    status: "unverified",
    source: "sms",
    confidence: 20,
    description: `Queued through offline SMS fallback${payload.disasterLabel ? ` (${payload.disasterLabel})` : ""}.`,
    severity: null,
    image_url: null,
    images: [],
    created_at: isoNow,
    updated_at: isoNow,
  } satisfies BackendReport;
}
