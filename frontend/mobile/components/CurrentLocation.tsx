import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

type LocationType = {
  lat: number;
  lng: number;
};

type LocationCaptureProps = {
  location: LocationType | null;
  onLocationChange: (loc: LocationType) => void;
  barangay: string;
  onBarangayChange: (value: string) => void;
};

export default function LocationCapture({
  location,
  onLocationChange,
  barangay,
  onBarangayChange,
}: LocationCaptureProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reverse geocode with OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data: any = await res.json();
      const a = data.address || {};
      const parts = [
        a.village || a.suburb || a.neighbourhood || a.hamlet,
        a.town || a.city_district || a.municipality || a.county,
        a.city || a.state,
      ].filter(Boolean);

      return parts.slice(0, 2).join(", ");
    } catch {
      return "";
    }
  };

  // Capture location using expo-location
  const captureLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ask permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        setLoading(false);
        return;
      }

      // Get current position
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude: lat, longitude: lng } = pos.coords;
      onLocationChange({ lat, lng });

      const placeName = await reverseGeocode(lat, lng);
      if (placeName) onBarangayChange(placeName);

    } catch (err: any) {
      setError("Could not get location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-capture on mount
  useEffect(() => {
    if (!location) captureLocation();
  }, []);

  return (
    <View style={{ marginVertical: 10 }}>
      {/* Location card */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 10 }}>
        {loading ? (
          <ActivityIndicator size="small" style={{ marginRight: 10 }} />
        ) : (
          <Text style={{ marginRight: 10 }}>📍</Text>
        )}

        <View style={{ flex: 1 }}>
          {location ? (
            <>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontWeight: "bold" }}>GPS: </Text>
                <Text>{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</Text>
              </View>
            </>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : (
            <Text style={{ color: "gray" }}>Getting your location...</Text>
          )}
        </View>

        <TouchableOpacity onPress={captureLocation} disabled={loading} style={{ padding: 8 }}>
          <Text>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Barangay display */}
      <View
        style={{
          height: 50,
          borderRadius: 12,
          paddingHorizontal: 12,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: barangay ? "#000" : "#999" }}>
          {barangay || "Barangay / Area name (auto-detected)"}
        </Text>
      </View>
    </View>
  );
}
