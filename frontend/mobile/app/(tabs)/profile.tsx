import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import { clearSession, fetchMyProfile, getStoredUser, login, register, saveSession, type BackendUser } from "@/lib/api";
import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const { menuOpen, toggleMenu } = useDrawer();
  const { colors } = useTheme();
  const homeStyle = createHomeStyles(colors);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<BackendUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      const storedUser = await getStoredUser();
      if (active) {
        setCurrentUser(storedUser);
      }

      if (!storedUser) {
        return;
      }

      try {
        const freshProfile = await fetchMyProfile();
        if (active) {
          setCurrentUser(freshProfile);
        }
      } catch {
        // Keep the stored user for a simple offline-friendly experience.
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit() {
    setSubmitting(true);

    try {
      const response =
        mode === "login"
          ? await login(phoneNumber, password)
          : await register(name, phoneNumber, password);

      await saveSession(response.token, response.user);
      setCurrentUser(response.user);
      setPassword("");
      if (mode === "register") {
        setName("");
      }

      Alert.alert(
        mode === "login" ? "Login successful" : "Account created",
        `Welcome, ${response.user.name}.`,
      );
    } catch (error) {
      Alert.alert(mode === "login" ? "Login failed" : "Registration failed", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await clearSession();
    setCurrentUser(null);
    setPhoneNumber("");
    setPassword("");
    Alert.alert("Logged out", "Your mobile session has been cleared.");
  }

  return (
    <ImageBackground source={require("@/assets/images/bg.png")} style={{ flex: 1 }} resizeMode="cover">
      <View style={homeStyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Login to sync reports with the backend, or keep using guest mode on this device.</Text>

          {currentUser ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{currentUser.name}</Text>
              <Text style={styles.cardMeta}>{currentUser.role}</Text>
              <Text style={styles.cardMeta}>{currentUser.phone_number}</Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
                <Text style={styles.secondaryButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.modeRow}>
                <TouchableOpacity
                  style={[styles.modeButton, mode === "login" ? styles.modeButtonActive : null]}
                  onPress={() => setMode("login")}
                >
                  <Text style={styles.modeButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeButton, mode === "register" ? styles.modeButtonActive : null]}
                  onPress={() => setMode("register")}
                >
                  <Text style={styles.modeButtonText}>Register</Text>
                </TouchableOpacity>
              </View>

              {mode === "register" ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Full name"
                  placeholderTextColor="#c4b8b8"
                  style={styles.input}
                />
              ) : null}

              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone number"
                placeholderTextColor="#c4b8b8"
                keyboardType="phone-pad"
                style={styles.input}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#c4b8b8"
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity
                style={[styles.primaryButton, submitting ? { opacity: 0.7 } : null]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                <Text style={styles.primaryButtonText}>
                  {submitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#f1dede",
    marginBottom: 18,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "rgba(53, 2, 2, 0.92)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    padding: 18,
    gap: 14,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
  },
  cardMeta: {
    color: "#f1dede",
    fontSize: 15,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  modeButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  modeButtonActive: {
    backgroundColor: "#881616",
    borderColor: "#FAFEC0",
  },
  modeButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#2C0303",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButton: {
    borderRadius: 14,
    backgroundColor: "#d13030",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
