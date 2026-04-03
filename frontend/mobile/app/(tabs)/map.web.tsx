import React from 'react';
import { StyleSheet, View } from 'react-native';

type MapProps = {
  location?: {
    lat: number;
    lng: number;
  } | null;
};

const map = ({ location = null }: MapProps) => {
  const initialLat = location?.lat ?? 14.5995;
  const initialLng = location?.lng ?? 120.9842;

  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          html, body, #map {
            height: 100%; 
            margin: 0; 
            padding: 0;
          }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${initialLat}, ${initialLng}], 13);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap &copy; CARTO'
          }).addTo(map);
          const marker = L.marker([${initialLat}, ${initialLng}]).addTo(map).bindPopup('You are here').openPopup();

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            marker.setLatLng([lat, lng]).setPopupContent('Lat: ' + lat.toFixed(5) + ', Lng: ' + lng.toFixed(5)).openPopup();
          });
        </script>
      </body>
    </html>
  `;

  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(leafletHtml)}`;

  return (
    <View style={styles.container}>
      <iframe
        src={iframeSrc}
        style={{ flex: 1, width: '100%', height: '100%', border: 'none' }}
        title="Map"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default map;