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
};

const disasterMap: Record<number, string> = {
  1: "Flood",
  2: "Earthquake",
  3: "Typhoon",
  4: "Fire",
  5: "Volcano",
  6: "Landslide",
};

export default function ReportSent({ visible, disaster, onClose }: Props) {
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
          {disaster
            ? `${disasterMap[disaster]} report has been sent!`
            : "Your report has been sent!"}
        </Text>

        {/* checklist */}
        <View style={styles.checklist}>
        </View>

        {/* buttons */}
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Text style={styles.btnText}>Mark as Safe</Text>
            <Image source={require('@/assets/images/checkmark.png')} style={{ width: 27, height: 30, marginLeft: "auto", top: 4, marginRight: 4 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Text style={styles.btnText}>Open Route</Text>
            <Image source={require('@/assets/images/map.png')} style={{ width: 25, height: 26, marginLeft: "auto", top: 2, marginRight: 5 }} />
          </View>
        </TouchableOpacity>
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
    width: 160,
    height: 160,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F5F5F5",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,    
  },
  checklist: {
    width: "85%",
    height: 480,
    backgroundColor: "#1F2937",
    marginTop: 32,
    borderRadius: 12,
    marginBottom: 20,
  },
  check: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#430A0A",
    padding: 10,
    margin: 4,
    borderRadius: 25,
    width: 225,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  btnText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    fontWeight: 600,
    fontSize: 24,
    lineHeight: 15,
    left: 0,
    right: 20,
    bottom: 8,
  }
});