import { rememberReport, updateReport } from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const severityOptions = ["low", "medium", "high"] as const;

export default function ReportUpdateScreen() {
  const params = useLocalSearchParams<{
    reportId?: string;
    editToken?: string;
    disasterLabel?: string;
    barangay?: string;
    latitude?: string;
    longitude?: string;
  }>();

  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<(typeof severityOptions)[number]>("medium");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleUpdate() {
    if (!params.reportId) {
      Alert.alert("Missing report", "This report is missing an ID.");
      return;
    }

    setSubmitting(true);

    try {
      const updatedReport = await updateReport(Number(params.reportId), {
        description,
        severity,
        image_url: imageUrl || null,
        edit_token: params.editToken || null,
      });

      try {
        await rememberReport(updatedReport);
      } catch (storageError) {
        console.error("Could not cache updated report locally", storageError);
      }

      if (Platform.OS === "web") {
        window.alert("Report updated successfully.");
        router.replace("/reports");
      } else {
        Alert.alert("Report updated", "Your report details were saved successfully.", [
          {
            text: "OK",
            onPress: () => router.replace("/reports"),
          },
        ]);
      }
    } catch (error) {
      console.error("Report update failed", error);
      const message = error instanceof Error ? error.message : "Could not update this report.";

      if (Platform.OS === "web") {
        window.alert(`Update failed: ${message}`);
      }

      Alert.alert("Update failed", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.box, styles.box1]}>
        <Image source={require("@/assets/images/flood-yellow.png")} style={styles.leftIcon} />
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.boxText, { textAlign: "center" }]}>
            {params.disasterLabel || "Emergency"}
            {"\n"}
            Report
          </Text>
        </View>
      </View>

      <View style={[styles.box, styles.box2]}>
        <Image source={require("@/assets/images/location.png")} style={styles.leftLocationIcon} />
        <Text style={[styles.boxText, { left: 52, top: 17 }]}>Location</Text>
        <Text style={[styles.boxText, styles.subText, { left: 52, top: 30 }]}>
          {params.latitude && params.longitude ? `${params.latitude}, ${params.longitude}` : "Location unavailable"}
        </Text>
        <Image source={require("@/assets/images/reload.png")} style={styles.reloadIcon} />
      </View>

      <View style={[styles.box, styles.box3]}>
        <Text style={[styles.boxText, { fontSize: 14, left: 20 }]}>{params.barangay || "Barangay not available"}</Text>
      </View>

      <View style={[styles.box, styles.box4, { alignItems: "flex-start", paddingHorizontal: 20, paddingVertical: 18 }]}>
        <Text style={styles.boxText}>Severity</Text>
        <View style={styles.severityRow}>
          {severityOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.severityButton, severity === option ? styles.severityButtonActive : null]}
              onPress={() => setSeverity(option)}
            >
              <Text style={styles.severityButtonText}>{option.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={[styles.box, styles.box5]}>
        <Text style={[styles.boxText, { fontSize: 14, marginBottom: 12 }]}>Additional details (optional)</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Describe what is happening on-site"
          placeholderTextColor="#B5B5B5"
          style={styles.textArea}
        />
        <Text style={[styles.boxText, { fontSize: 14, marginTop: 16, marginBottom: 12 }]}>Photo URL (optional)</Text>
        <TextInput
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="Paste image URL here"
          placeholderTextColor="#B5B5B5"
          style={styles.textInput}
        />
      </View>

      <TouchableOpacity style={[styles.box, styles.box6, submitting ? { opacity: 0.7 } : null]} onPress={handleUpdate} disabled={submitting}>
        <Image source={require("@/assets/images/submit.png")} style={styles.submitIcon} />
        <View style={styles.centeredTextContainer}>
          <Text style={[styles.boxText, { textAlign: "center", fontSize: 24 }]}>
            {submitting ? "Saving..." : "Update Report"}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 120,
  },
  box: {
    width: 309,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  box1: {
    height: 61,
    backgroundColor: "#500202",
    justifyContent: "center",
    alignItems: "center",
  },
  box2: {
    height: 87,
    backgroundColor: "#500202",
  },
  box3: {
    height: 49,
    backgroundColor: "#3A1D1D",
    justifyContent: "center",
  },
  box4: {
    minHeight: 87,
    backgroundColor: "#2C0303",
  },
  box5: {
    minHeight: 246,
    backgroundColor: "#3F1F1F",
    padding: 20,
  },
  box6: {
    height: 54,
    backgroundColor: "#881616",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 20,
    color: "#FFFFFF",
  },
  centeredTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  leftIcon: {
    width: 25,
    height: 27,
    left: 20,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -13.5 }],
  },
  leftLocationIcon: {
    width: 25,
    height: 27,
    position: "absolute",
    left: 20,
    top: 14,
  },
  subText: {
    color: "#B5B5B5",
    fontSize: 14,
  },
  reloadIcon: {
    width: 25,
    height: 26,
    left: 264,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -13.5 }],
  },
  severityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  severityButton: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  severityButtonActive: {
    backgroundColor: "#881616",
    borderColor: "#FAFEC0",
  },
  severityButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#2C0303",
    color: "#FFFFFF",
    padding: 14,
    textAlignVertical: "top",
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#2C0303",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  submitIcon: {
    width: 25,
    height: 27,
    left: 45,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -13.5 }],
  },
});
