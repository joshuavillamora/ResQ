import React, { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  StyleSheet
} from "react-native";

type Props = {
  visible: boolean;
  disaster: number | null;
  onClose?: () => void;
  onMarkSafe?: () => void;
  onOpenRoute?: () => void;
  submitting?: boolean;
};

const disasterMap: Record<number, string> = {
  1: "Flood",
  2: "Earthquake",
  3: "Typhoon",
  4: "Fire",
  5: "Volcano",
  6: "Landslide",
};

export default function ReportSent({ visible, disaster, onClose, onMarkSafe, onOpenRoute, submitting = false }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    if (visible) {
      // reset before animating in
      fadeAnim.setValue(0);
      translateY.setValue(40);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    } else {
      // animate out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.overlay,
        {
          opacity: fadeAnim, // 👈 whole screen fades
        },
      ]}
    >
      {/* 🔥 Optional Blur Background */}
      <BlurView intensity={50} style={StyleSheet.absoluteFill} />

      {/* LOGO */}
      <Animated.Image
        source={require("@/assets/images/resq-logo-with-wordmark.png")}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
        resizeMode="contain"
      />

      {/* CONTENT */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.title}>
          {submitting
            ? "Sending your report..."
            : disaster
            ? `${disasterMap[disaster]} report sent`
            : "Your report has been sent"}
        </Text>

        {/* checklist */}
        <View style={styles.checklist}>
          <Text style={styles.check}>✔ Location captured</Text>
          <Text style={styles.check}>✔ Report delivered</Text>
          <Text style={styles.check}>✔ Authorities notified</Text>
        </View>

        {/* buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={onMarkSafe ?? onClose} style={styles.safeBtn} disabled={submitting}>
            <Text>{submitting ? "Please wait" : "Mark as Safe"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.routeBtn} onPress={onOpenRoute} disabled={submitting}>
            <Text style={{ color: "#fff" }}>Open Route</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,51,51,0.9)", // slightly transparent for nicer overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  checklist: {
    marginTop: 12,
  },
  check: {
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  safeBtn: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  routeBtn: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
  },
});
