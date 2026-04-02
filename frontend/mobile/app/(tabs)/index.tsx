import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import LocationLocator from "@/components/CurrentLocation";
import useDrawer from "@/hooks/UseDrawer";
import useTheme from "@/hooks/UseTheme";
import { BlurView } from "expo-blur";
import { Text, TouchableOpacity, View, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Index() {
  const { colors } = useTheme();
  const { menuOpen, toggleMenu } = useDrawer();
  const Homestyle = createHomeStyles(colors);

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [barangay, setBarangay] = useState<string>("");

  const buttons = [
    { id: 1, label: 'Flood', image: require('@/assets/images/flood.png') },
    { id: 2, label: 'Earthquake', image: require('@/assets/images/earthquake.png') },
    { id: 3, label: 'Typhoon', image: require('@/assets/images/typhoon.png') },
    { id: 4, label: 'Fire', image: require('@/assets/images/fire.png') },
    { id: 5, label: 'Volcano', image: require('@/assets/images/volcano.png') },
    { id: 6, label: 'Landslide', image: require('@/assets/images/landslide.png') },
  ];

  const handleButtonPress = (id: number) => {
    console.log(`Button ${id} pressed`);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/bg.png')}
      style={{flex: 1}}
      resizeMode='cover'
    >
      <SafeAreaView style={Homestyle.safeArea}>
        <Header menuOpen={menuOpen} onMenuToggle={toggleMenu} />
        <View style={[Homestyle.infoBar, { alignSelf: "center" }]}>
          <LocationLocator
            location={location}
            onLocationChange={setLocation}
            barangay={barangay}
            onBarangayChange={setBarangay}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 16, marginTop: 4 }}>
            <Text style={{ color: "#FFDBDB", fontSize: 16, fontWeight: "bold" }}>Network: Connected </Text>
            <Text style={{ color: "#FAFEC0", fontSize: 16, fontWeight: "bold" }}>(SMS)</Text>
          </View>
        </View>
        <View style={Homestyle.disasterGridContainer}>
            <View style={Homestyle.disasterGrid}>
              {buttons.map((btn) => (
                <TouchableOpacity
                  key={btn.id}
                  style={Homestyle.disasterButton}
                  onPress={() => handleButtonPress(btn.id)}
                  activeOpacity={0.85}
                >
                  <BlurView intensity={15} style={Homestyle.disasterButtonGradient}>
                    <Image source={btn.image} style={Homestyle.disasterImage} />
                    <Text style={Homestyle.disasterButtonText}>{btn.label}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
