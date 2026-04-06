import { fetchPublicReports, normalizeDisasterLabel, normalizeStatusLabel, type BackendReport } from "@/lib/api";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

type LocationPoint = {
  lat: number;
  lng: number;
};

function markerColor(disasterType: string) {
  if (disasterType === "fire") {
    return "#ff4d4f";
  }
  if (disasterType === "flood") {
    return "#3b82f6";
  }
  if (disasterType === "landslide") {
    return "#f97316";
  }
  if (disasterType === "earthquake") {
    return "#8b5cf6";
  }
  if (disasterType === "medical emergency") {
    return "#10b981";
  }
  if (disasterType.includes("typhoon")) {
    return "#f59e0b";
  }
  return "#ef4444";
}

function buildLeafletHtml(reports: BackendReport[], location: LocationPoint | null) {
  const incidentMarkers = reports.map((report) => ({
    id: report.id,
    label: normalizeDisasterLabel(report.disaster_type),
    status: normalizeStatusLabel(report.status),
    barangay: report.barangay,
    confidence: report.confidence,
    lat: report.latitude,
    lng: report.longitude,
    color: markerColor(report.disaster_type),
  }));

  const defaultCenter = location ?? { lat: 10.7086, lng: 122.5652 };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; background: #1a0d0d; }
          .leaflet-control-attribution { display: none; }
          .incident-dot {
            width: 14px;
            height: 14px;
            border-radius: 999px;
            border: 2px solid rgba(255,255,255,0.85);
            box-shadow: 0 0 0 4px rgba(255,255,255,0.15);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          const reports = ${JSON.stringify(incidentMarkers)};
          const userLocation = ${JSON.stringify(location)};
          const map = L.map('map').setView([${defaultCenter.lat}, ${defaultCenter.lng}], 12.8);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
          }).addTo(map);

          const bounds = [];

          reports.forEach((report) => {
            const icon = L.divIcon({
              className: '',
              html: '<div class="incident-dot" style="background:' + report.color + ';"></div>',
              iconSize: [18, 18],
              iconAnchor: [9, 9],
            });

            L.marker([report.lat, report.lng], { icon })
              .addTo(map)
              .bindPopup(
                '<strong>' + report.label + '</strong><br/>' +
                report.barangay + '<br/>' +
                report.status + ' · Confidence ' + report.confidence + '%'
              );

            bounds.push([report.lat, report.lng]);
          });

          if (userLocation) {
            L.circleMarker([userLocation.lat, userLocation.lng], {
              radius: 8,
              color: '#ffffff',
              weight: 2,
              fillColor: '#0ea5e9',
              fillOpacity: 0.95,
            }).addTo(map).bindPopup('You are here');

            bounds.push([userLocation.lat, userLocation.lng]);
          }

          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [28, 28] });
          }
        </script>
      </body>
    </html>
  `;
}

export default function MapScreen() {
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [location, setLocation] = useState<LocationPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const reportPayload = await fetchPublicReports();

        let nextLocation: LocationPoint | null = null;
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status === "granted") {
          const currentPosition = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          nextLocation = {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude,
          };
        }

        if (!active) {
          return;
        }

        setReports(reportPayload);
        setLocation(nextLocation);
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : "Could not load the incident map.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const leafletHtml = useMemo(() => buildLeafletHtml(reports, location), [location, reports]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: leafletHtml }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
      />

      {loading ? (
        <View style={styles.banner}>
          <ActivityIndicator color="#ffffff" />
          <Text style={styles.bannerText}>Loading incident map...</Text>
        </View>
      ) : null}

      {error ? (
        <View style={[styles.banner, styles.errorBanner]}>
          <Text style={styles.bannerText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  banner: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 14,
    backgroundColor: "rgba(53, 2, 2, 0.92)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorBanner: {
    top: 84,
  },
  bannerText: {
    color: "#ffffff",
    flex: 1,
  },
});
