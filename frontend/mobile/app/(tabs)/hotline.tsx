import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import { fetchHotlines, type HotlineRecord } from "@/lib/api";
import React, { useEffect, useMemo, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const fallbackHotlines: HotlineRecord[] = [
  { id: 1, name: "ICER (Rescue/Ambulance)", phone_number: "333-3333 / 333-2333", category: "rescue", created_at: null },
  { id: 2, name: "Police (ICPO)", phone_number: "337-0400 / 166", category: "police", created_at: null },
  { id: 3, name: "Fire (BFP Iloilo City)", phone_number: "337-3011 / 337-4948", category: "fire", created_at: null },
];

export default function Hotline() {
  const { menuOpen, toggleMenu } = useDrawer();
  const { colors } = useTheme();
  const homeStyle = createHomeStyles(colors);
  const [hotlines, setHotlines] = useState<HotlineRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadHotlines = async () => {
      try {
        const payload = await fetchHotlines();
        if (!active) {
          return;
        }
        setHotlines(payload);
      } catch (error) {
        if (!active) {
          return;
        }
        setHotlines(fallbackHotlines);
        setLoadError(error instanceof Error ? error.message : "Could not load hotlines.");
      }
    };

    loadHotlines();

    return () => {
      active = false;
    };
  }, []);

  const sortedHotlines = useMemo(
    () => [...hotlines].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    [hotlines],
  );

  return (
    <ImageBackground source={require("@/assets/images/bg.png")} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={homeStyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={{ height: 90 }} />

        <ScrollView style={{ flex: 1, marginBottom: 100 }} contentContainerStyle={styles.cardContainer}>
          {loadError ? <Text style={styles.errorText}>Using fallback hotlines: {loadError}</Text> : null}

          {sortedHotlines.map((hotline) => (
            <EmergencyCard
              key={hotline.id}
              title={hotline.name}
              category={hotline.category}
              phoneNumber={hotline.phone_number}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function EmergencyCard({ title, category, phoneNumber }: { title: string; category: string; phoneNumber: string }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCategory}>{category.toUpperCase()}</Text>
      <Text style={styles.cardNumber}>{phoneNumber}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignSelf: "center",
    alignItems: "center",
    elevation: 6,
    width: 326,
    minHeight: 102,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
    color: "#881616",
  },
  cardNumber: {
    fontSize: 16,
  },
  errorText: {
    color: "#ffb4b4",
    textAlign: "center",
  },
});
