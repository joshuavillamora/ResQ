import React, { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
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

const disasterTaglines: Record<number, string> = {
  1: "Move to higher ground immediately!",
  2: "Expect aftershocks and stay alert!",
  3: "Stay indoors and away from windows!",
  4: "Smoke spreads faster than flames!",
  5: "Evacuate immediately when advised!",
  6: "Watch for shifting ground and debris!",
};

const { width } = Dimensions.get("window");
const CHECKLIST_WIDTH = width * 0.85;
const ITEM_WIDTH = CHECKLIST_WIDTH - 40;

function FireCard1() {
  return (
    <View style={styles.checklistcard}>
      <Text style={styles.cardTitle}>Fire Alert</Text>
      <Text style={styles.cardText}>Smoke spreads faster than flames!</Text>
    </View>
  );
}

function FireCard2() {
  return (
    <View style={styles.checklistcard}>
      <Text style={styles.cardTitle}>AVOID</Text>
      <Text style={styles.cardText}>• Panic running</Text>
      <Text style={styles.cardText}>• Smoke inhalation</Text>
      <Text style={styles.cardText}>• Elevators</Text>
    </View>
  );
}

function FireCard3() {
  return (
    <View style={styles.checklistcard}>
      <Text style={styles.cardTitle}>Escape Plan</Text>
    </View>
  );
}

const disasterCards: Record<number, (() => JSX.Element)[]> = {
  4: [FireCard1, FireCard2, FireCard3],
};

export default function ReportSent({
  visible,
  disaster,
  onClose,
  onMarkSafe,
  onOpenRoute,
  submitting = false,
}: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const listRef = useRef<ScrollView>(null);
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    if (visible) {
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
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, translateY, visible]);

  useEffect(() => {
    if (visible) {
      setIndex(0);
      listRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [visible]);

  const cards = disaster ? disasterCards[disaster] || [] : [];

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[styles.overlay, { opacity: fadeAnim }]}
    >
      <BlurView intensity={50} style={StyleSheet.absoluteFill} />

      <Animated.Image
        source={require("@/assets/images/resq-logo-with-wordmark.png")}
        style={[styles.logo, { opacity: fadeAnim, transform: [{ translateY }] }]}
        resizeMode="contain"
      />

      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY }] }]}
      >
        <Text style={styles.title}>
          {submitting
            ? "Sending your report..."
            : disaster
              ? `${disasterMap[disaster]} report has been sent!`
              : "Your report has been sent!"}
        </Text>

        <View style={styles.checklist}>
          <Text style={styles.procedureLabel}>
            Emergency procedures that might help your case:
          </Text>
          <Text style={styles.tagline}>
            {disaster ? disasterTaglines[disaster] : "Stay safe!"}
          </Text>

          <ScrollView
            horizontal
            ref={listRef}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            style={{ width: ITEM_WIDTH }}
          >
            {cards.map((Card, i) => (
              <View key={i} style={{ width: ITEM_WIDTH, alignItems: "center" }}>
                <Card />
              </View>
            ))}
          </ScrollView>

          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() => {
                const prev = index - 1;
                if (prev >= 0) {
                  setIndex(prev);
                  listRef.current?.scrollTo({ x: prev * ITEM_WIDTH, animated: true });
                }
              }}
            >
              <Text style={styles.navArrow}>←</Text>
            </TouchableOpacity>

            <Text style={styles.navDots}>
              {cards.map((_, i) => (i === index ? "●" : "○")).join("  ")}
            </Text>

            <TouchableOpacity
              onPress={() => {
                const next = index + 1;
                if (next < cards.length) {
                  setIndex(next);
                  listRef.current?.scrollTo({ x: next * ITEM_WIDTH, animated: true });
                }
              }}
            >
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={onMarkSafe ?? onClose}
          style={[styles.button, submitting && styles.buttonDisabled]}
          disabled={submitting}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.btnText}>
              {submitting ? "Please wait" : "Mark as Safe"}
            </Text>
            <Image
              source={require("@/assets/images/checkmark.png")}
              style={{ width: 27, height: 30, marginLeft: "auto", top: 4, marginRight: 4 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenRoute}
          style={[styles.button, submitting && styles.buttonDisabled]}
          disabled={submitting}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.btnText}>Open Route</Text>
            <Image
              source={require("@/assets/images/map.png")}
              style={{ width: 25, height: 26, marginLeft: "auto", top: 2, marginRight: 5 }}
            />
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
    backgroundColor: "rgba(255,51,51,0.9)",
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
    width: CHECKLIST_WIDTH,
    height: 440,
    backgroundColor: "#1F2937",
    marginTop: 32,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 24,
    alignItems: "center",
    gap: 18,
  },
  procedureLabel: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFB00",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  checklistcard: {
    width: ITEM_WIDTH,
    height: 180,
    borderRadius: 20,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  cardText: {
    color: "#D1D5DB",
    fontSize: 14,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  navArrow: {
    color: "white",
    fontSize: 20,
    paddingHorizontal: 8,
  },
  navDots: {
    color: "white",
    fontSize: 12,
    letterSpacing: 2,
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  btnText: {
    position: "absolute",
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 15,
    left: 0,
    right: 20,
    bottom: 8,
  },
});