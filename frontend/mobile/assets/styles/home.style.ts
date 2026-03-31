import { ColorScheme } from "@/hooks/UseTheme";
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
    },
    header: { 
      position: "absolute",
      top: 20,
      left: 20,
      right: 20,
      paddingHorizontal: 20,
      paddingVertical: 14,
      paddingBottom: 14,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      height: 70,
      width: "auto",
    },
    titleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    titleTextContainer: {
      flex: 1,
    },
    title: {
      fontSize: 25,
      fontWeight: "700",
      letterSpacing: -1,
      marginBottom: 2,
      color: colors.text,
    },
    Icontitle: {
      fontSize: 22,
      fontWeight: "700",
      letterSpacing: -1,
      marginBottom: 0,
      color: colors.text,
    },
    subtitle: {
      fontSize: 17,
      fontWeight: "500",
      color: colors.textMuted,
    },
    inputSection: {
      paddingHorizontal: 24,
      paddingBottom: 12,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 16,
    },
    input: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 16,
      fontSize: 17,
      maxHeight: 120,
      fontWeight: "500",
      backgroundColor: colors.backgrounds.input,
      borderColor: colors.border,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    addButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    infoBar: {
      marginTop: 110,
      marginHorizontal: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      position: "relative",
    },
    infoCircleButton: {
      position: "absolute",
      top: -18,
      right: -8,
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: "#FFFFFF",
      backgroundColor: "#D62828",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    infoCircleButtonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "800",
      letterSpacing: 1,
    },
    infoBarTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginRight: 84,
    },
    infoBarSubtitle: {
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 4,
      marginRight: 84,
    },
    disasterGridContainer: {
      padding: 16,
      marginTop: 16,
    },
    disasterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    },
    disasterButton: {
      width: 150,
      height: 150,
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 2,                       // the border
      borderColor: 'rgba(255,255,255,0.63)', // white-ish border like your CSS
    },

    disasterButtonBlur: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 12,
    },

    disasterButtonGradient: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },

    disasterImage: {
      width: 90,
      height: 90,
      marginBottom: 8,
      resizeMode: 'contain',
    },

    disasterButtonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  return styles;
};