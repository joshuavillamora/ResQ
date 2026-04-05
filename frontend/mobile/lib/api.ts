import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const TOKEN_KEY = "resq_mobile_token";
const USER_KEY = "resq_mobile_user";
const RECENT_REPORTS_KEY = "resq_recent_reports";

export type BackendUser = {
  id: number;
  name: string;
  phone_number: string;
  role: string;
  created_at: string | null;
};

export type BackendReport = {
  id: number;
  user_id: number | null;
  disaster_type: string;
  latitude: number;
  longitude: number;
  barangay: string;
  status: string;
  source: string;
  confidence: number;
  description: string | null;
  severity: string | null;
  image_url: string | null;
  images: string[];
  created_at: string | null;
  updated_at: string | null;
  edit_token?: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: BackendUser;
};

export type HotlineRecord = {
  id: number;
  name: string;
  phone_number: string;
  category: string;
  created_at: string | null;
};

type ApiError = Error & {
  status?: number;
};

function getBaseUrl() {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string; resqApiBaseUrl?: string } | undefined;
  if (extra?.resqApiBaseUrl) {
    return extra.resqApiBaseUrl;
  }

  if (extra?.apiBaseUrl) {
    return extra.apiBaseUrl;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://127.0.0.1:8000";
}

export const API_BASE_URL = getBaseUrl();

async function getStoredToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function getStoredUser() {
  const rawValue = await AsyncStorage.getItem(USER_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as BackendUser;
  } catch {
    return null;
  }
}

export async function saveSession(token: string, user: BackendUser) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function rememberReport(report: BackendReport) {
  const reports = await getRememberedReports();
  const nextReports = [report, ...reports.filter((item) => item.id !== report.id)];
  await AsyncStorage.setItem(RECENT_REPORTS_KEY, JSON.stringify(nextReports.slice(0, 20)));
}

export async function getRememberedReports() {
  const rawValue = await AsyncStorage.getItem(RECENT_REPORTS_KEY);
  if (!rawValue) {
    return [] as BackendReport[];
  }

  try {
    return JSON.parse(rawValue) as BackendReport[];
  } catch {
    return [] as BackendReport[];
  }
}

async function request<T>(path: string, init?: RequestInit, auth?: boolean): Promise<T> {
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = await getStoredToken();
    if (!token) {
      throw new Error("Please login first.");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let detail = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      detail = payload.detail ?? payload.message ?? detail;
    } catch {
      // Keep default detail if response is not JSON.
    }

    const error = new Error(detail) as ApiError;
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}

export async function login(phoneNumber: string, password: string) {
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber, password }),
  });
}

export async function register(name: string, phoneNumber: string, password: string) {
  return request<LoginResponse>("/register", {
    method: "POST",
    body: JSON.stringify({ name, phone_number: phoneNumber, password, role: "civilian" }),
  });
}

export async function fetchMyProfile() {
  return request<BackendUser>("/me", undefined, true);
}

export async function createReport(payload: {
  disaster_type: string;
  latitude: number;
  longitude: number;
  barangay: string;
}) {
  const token = await getStoredToken();

  try {
    return await request<BackendReport>(
      "/report",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      Boolean(token),
    );
  } catch (error) {
    const apiError = error as ApiError;

    if (token && apiError.status === 401) {
      await clearSession();
      return request<BackendReport>("/report", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    throw error;
  }
}

export async function updateReport(
  reportId: number,
  payload: {
    description?: string;
    severity?: string;
    image_url?: string | null;
    edit_token?: string | null;
  },
) {
  const token = await getStoredToken();

  try {
    return await request<BackendReport>(
      `/report/${reportId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      Boolean(token),
    );
  } catch (error) {
    const apiError = error as ApiError;

    if (token && payload.edit_token && apiError.status === 401) {
      await clearSession();
      return request<BackendReport>(`/report/${reportId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    }

    throw error;
  }
}

export async function fetchMyReports() {
  return request<BackendReport[]>("/reports/mine", undefined, true);
}

export async function fetchHotlines() {
  return request<HotlineRecord[]>("/hotlines");
}

export async function fetchPublicReports() {
  return request<BackendReport[]>("/reports/feed");
}

export function normalizeDisasterLabel(disasterType: string) {
  return disasterType
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function normalizeStatusLabel(status: string) {
  if (status === "unverified") {
    return "Pending";
  }

  if (status === "responding") {
    return "In Progress";
  }

  if (status === "false_report") {
    return "False Report";
  }

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
