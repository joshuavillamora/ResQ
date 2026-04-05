import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import { fetchMyReports, getRememberedReports, normalizeDisasterLabel, normalizeStatusLabel, type BackendReport } from "@/lib/api";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

export default function Reports() {
  const { menuOpen, toggleMenu } = useDrawer();
  const { colors } = useTheme();
  const homeStyle = createHomeStyles(colors);
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      const payload = await fetchMyReports();
      setReports(payload);
      setLoadError(null);
    } catch {
      const rememberedReports = await getRememberedReports();
      setReports(rememberedReports);
      setLoadError(rememberedReports.length ? null : "Login to load your synced report history.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports]),
  );

  return (
    <ImageBackground source={require("@/assets/images/bg.png")} style={{ flex: 1 }} resizeMode="cover">
      <View style={homeStyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <ScrollView contentContainerStyle={{ paddingTop: 110, paddingHorizontal: 20, paddingBottom: 140 }}>
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Reports</Text>
          <Text style={{ color: "#f1dede", marginBottom: 20 }}>
            Review reports submitted from this device or from your logged-in account.
          </Text>

          {loadError ? <Text style={{ color: "#ffb4b4", marginBottom: 16 }}>{loadError}</Text> : null}

          {reports.map((report) => (
            <View
              key={report.id}
              style={{
                backgroundColor: "rgba(53, 2, 2, 0.92)",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                padding: 18,
                marginBottom: 14,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "700" }}>
                  {normalizeDisasterLabel(report.disaster_type)}
                </Text>
                <Text style={{ color: "#FAFEC0", fontWeight: "700" }}>{report.confidence}%</Text>
              </View>
              <Text style={{ color: "#f1dede", marginTop: 10 }}>{report.barangay}</Text>
              <Text style={{ color: "#FFDBDB", marginTop: 6 }}>
                {normalizeStatusLabel(report.status)} • {report.source.toUpperCase()}
              </Text>
              {report.description ? (
                <Text style={{ color: "#ffffff", marginTop: 10 }}>{report.description}</Text>
              ) : (
                <Text style={{ color: "#c6b7b7", marginTop: 10 }}>No additional details yet.</Text>
              )}
            </View>
          ))}

          {!reports.length && !loadError ? (
            <View style={{ backgroundColor: "rgba(53, 2, 2, 0.92)", borderRadius: 16, padding: 20 }}>
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>No reports yet.</Text>
              <Text style={{ color: "#f1dede", marginTop: 6 }}>Your reports will appear here after you submit them.</Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
