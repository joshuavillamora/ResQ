import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const ReportUpdateScreen = () => {
  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Box1 />
        <Box2 />
        <Box3 />
        <Box4 />
        <Box5 />
        <Box6 />
      </ScrollView>
  );
};

export default ReportUpdateScreen;

const Box1 = () => (
    <View style={[styles.box, styles.box1]}>
        <Image 
            source={require('@/assets/images/flood-yellow.png')} 
            style={{
                width: 25, 
                height: 27, 
                left: 20,
                position: 'absolute',
                top: '50%',
                transform: [{ translateY: -13.5 }], 
            }}
        />
        <View style={styles.centeredTextContainer}>
            <Text style={[styles.boxText, {textAlign: 'center'}]}>Flood{'\n'}Emergency</Text>
        </View>
    </View>
);

const Box2 = () => (
    <View style={[styles.box, styles.box2]}>
        <Image
            source={require("@/assets/images/location.png")} 
            style={{
                width: 25,
                height: 27,
                position: 'absolute',
                left: 20,
                top: 14,
            }}   
        />
        <Text style={[styles.boxText, {left: 52, top: 17}]}>Location</Text>
        <Text style={[styles.boxText, {color: "#B5B5B5", fontSize: 14, left: 52, top: 30}]}>10.668900, 122.946600</Text>
        <Image 
            source={require('@/assets/images/reload.png')} 
            style={{
                width: 25, 
                height: 26, 
                left: 264,
                position: 'absolute',
                top: '50%',
                transform: [{ translateY: -13.5 }], 
            }}
        />
    </View>
);

const Box3 = () => (
    <View style={[styles.box, styles.box3]}>
        <Text style={styles.boxText}>Box 3</Text>
    </View>
);

const Box4 = () => (
    <View style={[styles.box, styles.box4]}>
        <Text style={styles.boxText}>Box 4</Text>
    </View>
);

const Box5 = () => (
    <View style={[styles.box, styles.box5]}>
        <Text style={styles.boxText}>Box 5</Text>
    </View>
);

const Box6 = () => (
    <View style={[styles.box, styles.box6]}>
        <Text style={styles.boxText}>Box 6</Text>
    </View>
);


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#c6c6c6",
  },
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },

  box: {
    width: 309,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    marginBottom: 16,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  box1: {
    height: 61,
    backgroundColor: "#500202",
    justifyContent: "center",
    alignItems: "center",
  },
  box2: {
    height: 87,
    backgroundColor: "#500202",
  },
  box3: {
    height: 49,
    backgroundColor: "#3A1D1D",
  },
  box4: {
    height: 87,
    backgroundColor: "#2C0303",
  },
  box5: {
    height: 246,
    backgroundColor: "#3F1F1F",
  },
  box6: {
    height: 54,
    backgroundColor: "#881616",
  },
  boxText: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 15,
    color: "#FFFFFF",
  },
  centeredTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});