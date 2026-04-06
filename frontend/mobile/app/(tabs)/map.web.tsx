import { fetchPublicReports, normalizeDisasterLabel, normalizeStatusLabel, type BackendReport } from "@/lib/api";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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

function buildLeafletHtml(reports: BackendReport[]) {
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
          const map = L.map('map').setView([10.7086, 122.5652], 12.8);

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

          if (bounds.length > 1) {
            map.fitBounds(bounds, { padding: [28, 28] });
          }
        </script>
      </body>
    </html>
  `;
}

export default function MapWebScreen() {
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        const payload = await fetchPublicReports();
        if (!active) {
          return;
        }
        setReports(payload);
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

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  const iframeSrc = useMemo(
    () => `data:text/html;charset=utf-8,${encodeURIComponent(buildLeafletHtml(reports))}`,
    [reports],
  );

  return (
    <View style={styles.container}>
      <iframe
        src={iframeSrc}
        style={{ flex: 1, width: "100%", height: "100%", border: "none" }}
        title="Incident Map"
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
