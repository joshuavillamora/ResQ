import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import React, { useState } from "react";
import { FlatList, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationType = "alert" | "check" | "truck";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

//To be replaced with API data (temporary mock data)
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "alert", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: false },
  { id: "2", type: "check", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: false },
  { id: "3", type: "truck", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: false },
  { id: "4", type: "alert", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
  { id: "5", type: "check", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
  { id: "6", type: "truck", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
  { id: "7", type: "alert", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
  { id: "8", type: "check", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
  { id: "9", type: "truck", message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", read: true },
];

const TYPE_COLOR: Record<NotificationType, string> = {
  alert: "#E05C2A",
  check: "#4BB89E",
  truck: "#E05C2A",
};

const TYPE_ICON: Record<NotificationType, string> = {
  alert: "⚠️",
  check: "✅",
  truck: "🚒",
};

export default function Notifications() {
  const { menuOpen, toggleMenu } = useDrawer();
  const { colors } = useTheme();
  const homeStyle = createHomeStyles(colors);

  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const markAsRead = (id: string) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ImageBackground source={require("@/assets/images/bg.png")} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={homeStyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={{ height: 90 }} />

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, marginBottom: 100 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={{ color: "#ffffff", fontSize: 24, fontWeight: "700", marginBottom: 8 }}>
                Notifications
              </Text>
              <Text style={{ color: "#f1dede", marginBottom: 12 }}>
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.`
                  : "You're all caught up."}
              </Text>
            </>
          }
          renderItem={({ item }) => {
            const accent = TYPE_COLOR[item.type];
            return (
              <TouchableOpacity
                onPress={() => markAsRead(item.id)}
                activeOpacity={0.75}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "rgba(53, 2, 2, 0.92)",
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: item.read ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)",
                  overflow: "hidden",
                  paddingVertical: 14,
                  paddingRight: 16,
                }}
              >
                {/* Left accent bar */}
                <View style={{ width: 4, alignSelf: "stretch", backgroundColor: accent, marginRight: 14 }} />

                {/* Icon bubble */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: accent + "25",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Text style={{ fontSize: 18 }}>{TYPE_ICON[item.type]}</Text>
                </View>

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: item.read ? "#f1dede" : "#ffffff",
                      fontSize: 13,
                      fontWeight: item.read ? "400" : "600",
                      lineHeight: 18,
                    }}
                  >
                    {item.message}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 4 }}>
                    {item.time}
                  </Text>
                </View>

                {/* Unread dot */}
                {!item.read && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent, marginLeft: 10 }} />
                )}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View
              style={{
                backgroundColor: "rgba(53, 2, 2, 0.92)",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
                padding: 20,
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>No notifications yet.</Text>
              <Text style={{ color: "#f1dede", marginTop: 6 }}>
                You'll be notified about nearby emergency reports here.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}
