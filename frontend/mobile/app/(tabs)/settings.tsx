import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { menuOpen, toggleMenu } = useDrawer();
  const { colors } = useTheme();
  const homeStyle = createHomeStyles(colors);

  const [shareLocationSOS, setShareLocationSOS] = useState(false);
  const [backgroundLocation, setBackgroundLocation] = useState(false);
  const [notifyContacts, setNotifyContacts] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (    
      <SafeAreaView style={[homeStyle.safeArea, { backgroundColor: "rgba(53, 2, 2, 0.92)" }]}>        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={{ height: 90 }} />

        <ScrollView
          style={{ flex: 1, marginBottom: 100 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, gap: 14 }}
        >
          <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "700", marginBottom: 8 }}>Settings</Text>
          <Text style={{ color: "#f1dede", marginBottom: 4 }}>
            Manage your location, contacts, and app preferences.
          </Text>

          {/* ── Location Sharing ── */}
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 6,
            }}
          >
            <Text style={{ color: "rgba(53, 2, 2, 0.92)", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
              Location Sharing
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
              <Text style={{ color: "#3a3a3a", fontSize: 13, flex: 1, paddingRight: 12 }}>
                Share location during SOS
              </Text>
              <Switch
                value={shareLocationSOS}
                onValueChange={setShareLocationSOS}
                trackColor={{ false: "rgba(0,0,0,0.15)", true: "#d13030" }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(0,0,0,0.15)"
              />
            </View>

            <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.1)" }} />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
              <Text style={{ color: "#3a3a3a", fontSize: 13, flex: 1, paddingRight: 12 }}>
                Background location during emergencies
              </Text>
              <Switch
                value={backgroundLocation}
                onValueChange={setBackgroundLocation}
                trackColor={{ false: "rgba(0,0,0,0.15)", true: "#d13030" }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(0,0,0,0.15)"
              />
            </View>
          </View>

          {/* ── Emergency Contacts ── */}
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 6,
            }}
          >
            <Text style={{ color: "#350202eb", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
              Emergency Contacts
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
              <Text style={{ color: "#3a3a3a", fontSize: 13, flex: 1, paddingRight: 12 }}>
                Notify contacts when SOS activated
              </Text>
              <Switch
                value={notifyContacts}
                onValueChange={setNotifyContacts}
                trackColor={{ false: "rgba(0,0,0,0.15)", true: "#d13030" }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(0,0,0,0.15)"
              />
            </View>
          </View>

          {/* ── App Preferences ── */}
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 6,
            }}
          >
            <Text style={{ color: "rgba(53, 2, 2, 0.92)", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
              App Preferences
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
              <Text style={{ color: "#3a3a3a", fontSize: 13, flex: 1, paddingRight: 12 }}>
                Dark mode
              </Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "rgba(0,0,0,0.15)", true: "#d13030" }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(0,0,0,0.15)"
              />
            </View>
          </View>

          {/* ── Account ── */}
          <View
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 18,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 6,
            }}
          >
            <Text style={{ color: "rgba(53, 2, 2, 0.92)", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
              Account
            </Text>

            <TouchableOpacity
              onPress={() => {/* navigate to change number screen */}}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}
            >
              <Text style={{ color: "#3a3a3a", fontSize: 13 }}>Change mobile number</Text>
              <Text style={{ color: "rgba(0,0,0,0.3)", fontSize: 22, lineHeight: 24 }}>›</Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.1)" }} />

            <TouchableOpacity
              onPress={() => {/* handle logout */}}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}
            >
              <Text style={{ color: "#3a3a3a", fontSize: 13 }}>Logout</Text>
              <Text style={{ color: "rgba(0,0,0,0.3)", fontSize: 22, lineHeight: 24 }}>›</Text>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: "rgba(0,0,0,0.1)" }} />

            <TouchableOpacity
              onPress={() => {/* handle delete account */}}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}
            >
              <Text style={{ color: "#C0392B", fontSize: 13, fontWeight: "600" }}>Delete account</Text>
              <Text style={{ color: "rgba(0,0,0,0.3)", fontSize: 22, lineHeight: 24 }}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>    
  );
}
