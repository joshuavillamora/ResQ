import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useTheme from "@/hooks/UseTheme";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Text, TouchableOpacity, View, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {toggleDarkMode,colors} = useTheme();
  const Homestyle = createHomeStyles(colors);

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
      resizeMode="center"
    >
      <SafeAreaView style={Homestyle.safeArea}>
        <Header />
        <View style={Homestyle.infoBar}>
          <TouchableOpacity style={Homestyle.infoCircleButton} activeOpacity={0.85}>
            <Text style={Homestyle.infoCircleButtonText}>SOS</Text>
          </TouchableOpacity>
          <Text style={Homestyle.infoBarTitle}></Text>
          <Text style={Homestyle.infoBarSubtitle}></Text>
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
