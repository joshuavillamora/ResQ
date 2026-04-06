import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import LocationLocator from "@/components/CurrentLocation";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import { createReport, rememberReport } from "@/lib/api";
import { buildLocalSmsReport, createClientReportId, getSmsSenderCode, sendFallbackSms } from "@/lib/smsFallback";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Alert, Image, ImageBackground, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DisasterButton = {
  id: number;
  label: string;
  backendType: string;
  image: number;
};

type ApiLikeError = Error & {
  status?: number;
};

function isNetworkFailure(error: unknown) {
  const apiError = error as ApiLikeError;
  return typeof apiError?.status !== "number";
}

export default function Index() {
  const { colors } = useTheme();
  const { menuOpen, toggleMenu, setOverlayVisible, setSelectedDisaster, setLatestReport } = useDrawer();
  const homeStyle = createHomeStyles(colors);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [barangay, setBarangay] = useState<string>("");
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const buttons: DisasterButton[] = [
    { id: 1, label: "Flood", backendType: "flood", image: require("@/assets/images/flood.png") },
    { id: 2, label: "Earthquake", backendType: "earthquake", image: require("@/assets/images/earthquake.png") },
    { id: 3, label: "Typhoon", backendType: "typhoon", image: require("@/assets/images/typhoon.png") },
    { id: 4, label: "Fire", backendType: "fire", image: require("@/assets/images/fire.png") },
    { id: 5, label: "Volcano", backendType: "volcano", image: require("@/assets/images/volcano.png") },
    { id: 6, label: "Landslide", backendType: "landslide", image: require("@/assets/images/landslide.png") },
  ];

  async function submitReport(button: DisasterButton) {
    if (!location) {
      Alert.alert("Location unavailable", "Please wait for the GPS capture to finish, then try again.");
      return;
    }

    const safeBarangay = barangay || "Unknown area";
    const clientReportId = createClientReportId();
    const senderCode = await getSmsSenderCode();

    setSubmittingId(button.id);

    try {
      const report = await createReport({
        disaster_type: button.backendType,
        latitude: location.lat,
        longitude: location.lng,
        barangay: safeBarangay,
        client_report_id: clientReportId,
        sms_sender_code: senderCode,
      });

      await rememberReport(report);
      setSelectedDisaster(button.id);
      setLatestReport({
        id: report.id,
        editToken: report.edit_token,
        disasterLabel: button.label,
        barangay: report.barangay,
        latitude: report.latitude,
        longitude: report.longitude,
        deliveryMethod: "api",
      });
      setOverlayVisible(true);
      return;
    } catch (error) {
      if (Platform.OS === "android" && isNetworkFailure(error)) {
        try {
          await sendFallbackSms({
            disasterType: button.backendType,
            latitude: location.lat,
            longitude: location.lng,
            barangay: safeBarangay,
            senderCode,
            clientReportId,
          });

          const localSmsReport = await buildLocalSmsReport({
            disasterType: button.backendType,
            disasterLabel: button.label,
            latitude: location.lat,
            longitude: location.lng,
            barangay: safeBarangay,
            senderCode,
            clientReportId,
          });

          await rememberReport(localSmsReport);
          setSelectedDisaster(button.id);
          setLatestReport({
            disasterLabel: button.label,
            barangay: safeBarangay,
            latitude: location.lat,
            longitude: location.lng,
            deliveryMethod: "sms",
          });
          setOverlayVisible(true);
          return;
        } catch (smsError) {
          Alert.alert("SMS fallback failed", smsError instanceof Error ? smsError.message : "Could not send the offline SMS report.");
          return;
        }
      }

      Alert.alert("Report failed", error instanceof Error ? error.message : "Could not send the report.");
    } finally {
      setSubmittingId(null);
    }
  }

  function confirmReport(button: DisasterButton) {
    if (!location) {
      Alert.alert("Location unavailable", "Please wait for the GPS capture to finish, then try again.");
      return;
    }

    Alert.alert(
      `Report ${button.label}?`,
      "This will send your current location to ResQ. If the backend is unreachable, Android will switch to SMS fallback automatically.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm report",
          style: "default",
          onPress: () => {
            void submitReport(button);
          },
        },
      ],
    );
  }

  return (
    <ImageBackground source={require("@/assets/images/bg.png")} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={homeStyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={[homeStyle.infoBar, { alignSelf: "center" }]}>
          <LocationLocator
            location={location}
            onLocationChange={setLocation}
            barangay={barangay}
            onBarangayChange={setBarangay}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 16, marginTop: 4 }}>
            <Text style={{ color: "#FFDBDB", fontSize: 16, fontWeight: "bold" }}>Report mode: </Text>
            <Text style={{ color: "#FAFEC0", fontSize: 16, fontWeight: "bold" }}>API first, offline SMS fallback</Text>
          </View>
        </View>
        <View style={homeStyle.disasterGridContainer}>
          <View style={homeStyle.disasterGrid}>
            {buttons.map((button) => (
              <TouchableOpacity
                key={button.id}
                style={homeStyle.disasterButton}
                onPress={() => confirmReport(button)}
                activeOpacity={0.85}
                disabled={submittingId !== null}
              >
                <BlurView intensity={15} style={homeStyle.disasterButtonGradient}>
                  <Image source={button.image} style={homeStyle.disasterImage} />
                  <Text style={homeStyle.disasterButtonText}>
                    {submittingId === button.id ? "Sending..." : button.label}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
