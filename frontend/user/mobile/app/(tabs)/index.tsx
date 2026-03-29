import { createHomeStyles } from "@/assets/styles/home.style";
import Header from "@/components/Header";
import useTheme from "@/hooks/UseTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const {toggleDarkMode,colors} = useTheme();
  const Homestyle = createHomeStyles(colors);

  const buttons = [
    { id: 1, label: 'Button 1' },
    { id: 2, label: 'Button 2' },
    { id: 3, label: 'Button 3' },
    { id: 4, label: 'Button 4' },
    { id: 5, label: 'Button 5' },
    { id: 6, label: 'Button 6' },
  ];

  const handleButtonPress = (id: number) => {
    console.log(`Button ${id} pressed`);
  };

  return (
    <LinearGradient colors={colors.gradients.background} style={Homestyle.container}>
      <SafeAreaView style={Homestyle.safeArea}>
        <Header />
        <View style={Homestyle.infoBar}>
          <TouchableOpacity style={Homestyle.infoCircleButton} activeOpacity={0.85}>
            <Text style={Homestyle.infoCircleButtonText}>SOS</Text>
          </TouchableOpacity>
          <Text style={Homestyle.infoBarTitle}>Agi si carlos</Text>
          <Text style={Homestyle.infoBarSubtitle}>Fuck you zneb.</Text>
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
                  <LinearGradient
                    colors={colors.gradients.button}
                    style={Homestyle.disasterButtonGradient}
                  >
                    <Text style={Homestyle.disasterButtonText}>{btn.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
