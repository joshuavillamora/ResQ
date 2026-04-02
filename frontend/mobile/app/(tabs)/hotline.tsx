import React, { useState } from 'react';
import { ImageBackground, Text, StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import Header from '@/components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

const Hotline = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ImageBackground
        source={require('@/assets/images/bg.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <Header menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
        <View style={{ height: 90 }} />

        <ScrollView 
        style={{ flex: 1, marginBottom: 100 }}
        contentContainerStyle={styles.cardContainer}>
          <EmergencyCard
            title="ICER (Rescue/Ambulance)"
            landline="333-3333 / 333-2333"
            mobile="0919-066-1554"
          />
          <EmergencyCard
            title="Police (ICPO)"
            landline="337-0400 / 166"
            mobile="0908-377-0194"
          />
          <EmergencyCard
            title="Fire (BFP Iloilo City)"
            landline="337-3011 / 337-4948"
            mobile="0998-903-4593"
          />
          <EmergencyCard
            title="Red Cross Iloilo"
            landline="337-5950"
            mobile="N/A"
          />
          <EmergencyCard
            title="Coast Guard Iloilo"
            landline="N/A"
            mobile="0966-981-6557"
          />
          <EmergencyCard
            title="Major Hospitals"
            landline="St. Paul's Hospital: 337-2740"
            mobile="Western Visayas Medical Center: 321-2841"
          />
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

function EmergencyCard({ title, landline, mobile }: { title: string; landline: string; mobile: string }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardNumber}>{landline}</Text>
      <Text style={styles.cardNumber}>{mobile}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    padding: 20,
    gap: 20,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignSelf: "center",
    alignItems: "center",
    elevation: 6,
    width: 326,
    height: 102,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  cardNumber: {
    fontSize: 16,
  },
});

export default Hotline;