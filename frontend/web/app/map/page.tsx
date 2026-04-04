"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { fetchReports, normalizeDisasterLabel, normalizeStatusLabel, type BackendReport } from "@/lib/api";

type ZoneTone = "fire" | "flood" | "typhoon" | "landslide" | "volcano" | "earthquake" | "medical";

type Zone = {
  name: string;
  tone: ZoneTone;
  lat: number;
  lng: number;
  radius: number;
  fillColor: string;
  borderColor: string;
  note: string;
};

type LegendItem = {
  label: string;
  tone: ZoneTone;
  count: number;
  subtitle: string;
};

const legendConfig: Array<Omit<LegendItem, "count">> = [
  { label: "Fire", tone: "fire", subtitle: "Thermal hotspots" },
  { label: "Flood", tone: "flood", subtitle: "Water accumulation" },
  { label: "Typhoon", tone: "typhoon", subtitle: "Wind coverage" },
  { label: "Landslide", tone: "landslide", subtitle: "Slope movement" },
  { label: "Earthquake", tone: "earthquake", subtitle: "Ground movement" },
  { label: "Medical Emergency", tone: "medical", subtitle: "Priority medical help" },
  { label: "Volcano", tone: "volcano", subtitle: "Heat anomaly" },
];

const toneClassMap: Record<ZoneTone, string> = {
  fire: "app-map-chip--red",
  flood: "app-map-chip--blue",
  typhoon: "app-map-chip--orange",
  landslide: "app-map-chip--amber",
  volcano: "app-map-chip--rose",
  earthquake: "app-map-chip--violet",
  medical: "app-map-chip--green",
};

function toneFromDisaster(disasterType: string): ZoneTone {
  if (disasterType === "fire") {
    return "fire";
  }

  if (disasterType === "flood") {
    return "flood";
  }

  if (disasterType === "landslide") {
    return "landslide";
  }

  if (disasterType === "earthquake") {
    return "earthquake";
  }

  if (disasterType === "medical emergency") {
    return "medical";
  }

  if (disasterType.includes("typhoon")) {
    return "typhoon";
  }

  return "volcano";
}

function zonePalette(tone: ZoneTone): { fillColor: string; borderColor: string } {
  if (tone === "fire") {
    return { fillColor: "#ff5a52", borderColor: "#ff3b30" };
  }

  if (tone === "flood") {
    return { fillColor: "#4f84ff", borderColor: "#3b82f6" };
  }

  if (tone === "landslide") {
    return { fillColor: "#ff9e58", borderColor: "#f97316" };
  }

  if (tone === "typhoon") {
    return { fillColor: "#f7a85a", borderColor: "#f59e0b" };
  }

  if (tone === "earthquake") {
    return { fillColor: "#9b8cff", borderColor: "#8b5cf6" };
  }

  if (tone === "medical") {
    return { fillColor: "#34d399", borderColor: "#10b981" };
  }

  return { fillColor: "#ff4b6e", borderColor: "#ef4444" };
}

function reportToZone(report: BackendReport): Zone {
  const tone = toneFromDisaster(report.disaster_type);
  const palette = zonePalette(tone);
  const radius = 180 + Math.max(0, report.confidence) * 4;

  return {
    name: `${report.barangay} ${report.disaster_type} report`,
    tone,
    lat: report.latitude,
    lng: report.longitude,
    radius,
    fillColor: palette.fillColor,
    borderColor: palette.borderColor,
    note: `${normalizeStatusLabel(report.status)} · Confidence ${report.confidence}%`,
  };
}

export default function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const zones = useMemo(() => reports.map(reportToZone), [reports]);

  const legendItems = useMemo<LegendItem[]>(() => {
    return legendConfig.map((item) => ({
      ...item,
      count: zones.filter((zone) => zone.tone === item.tone).length,
    }));
  }, [zones]);

  const verifiedCount = useMemo(() => reports.filter((report) => report.status === "verified").length, [reports]);
  const hotspotCount = zones.length;
  const affectedBarangays = useMemo(() => new Set(reports.map((report) => report.barangay)).size, [reports]);
  const activeHazardTypes = useMemo(() => new Set(reports.map((report) => normalizeDisasterLabel(report.disaster_type))).size, [reports]);

  useEffect(() => {
    let active = true;

    const loadReports = async () => {
      try {
        const fetchedReports = await fetchReports();
        if (!active) {
          return;
        }
        setReports(fetchedReports);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Unable to load map reports");
      }
    };

    loadReports();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    let isDisposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let resizeRaf = 0;
    let map: any = null;

    const setupMap = async () => {
      const leafletModule = await import("leaflet");
      const L = leafletModule.default ?? leafletModule;

      if (isDisposed || !mapContainerRef.current) {
        return;
      }

      map = L.map(mapContainerRef.current, {
        center: [10.7086, 122.5652],
        zoom: 13.7,
        zoomControl: true,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        minZoom: 11,
        className: "app-map-tiles",
      }).addTo(map);

      const shapes = L.featureGroup();

      zones.forEach((zone) => {
        L.circle([zone.lat, zone.lng], {
          radius: zone.radius,
          color: zone.borderColor,
          fillColor: zone.fillColor,
          fillOpacity: 0.45,
          opacity: 0.9,
          weight: 1.5,
        })
          .bindTooltip(`${zone.name}<br/>${zone.note}`, {
            direction: "top",
            offset: [0, -6],
            opacity: 1,
            sticky: true,
            className: "app-map-tooltip",
          })
          .addTo(shapes);
      });

      shapes.addTo(map);

      const bounds = shapes.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.2), {
          animate: false,
          maxZoom: 14.1,
        });
      } else {
        map.setView([10.7086, 122.5652], 13.7);
      }

      const safeInvalidateSize = () => {
        if (isDisposed || !map) {
          return;
        }

        resizeRaf = requestAnimationFrame(() => {
          if (isDisposed || !map) {
            return;
          }

          map.invalidateSize();
        });
      };

      safeInvalidateSize();

      resizeObserver = new ResizeObserver(() => {
        safeInvalidateSize();
      });

      resizeObserver.observe(mapContainerRef.current);
    };

    setupMap();

    return () => {
      isDisposed = true;
      resizeObserver?.disconnect();
      cancelAnimationFrame(resizeRaf);
      map?.remove();
    };
  }, [zones]);

  return (
    <div className="app-page app-map-page">
      <div className="app-map-shell">
        <header className="app-map-header">
          <div>
            <p className="app-map-kicker">Operations map</p>
            <h1 className="app-map-title">Live incident coverage</h1>
            <p className="app-map-description">
              Monitor responder clusters, verified incident zones, and active hazard overlays around Iloilo City in real time.
            </p>
          </div>

          <div className="app-map-meta">
            <div className="app-map-meta-card">
              <p className="app-map-meta-label">Active zones</p>
              <p className="app-map-meta-value">{hotspotCount}</p>
              <p className="app-map-meta-note">Across {activeHazardTypes || 0} hazard types</p>
            </div>
            <div className="app-map-meta-card">
              <p className="app-map-meta-label">Verified reports</p>
              <p className="app-map-meta-value">{verifiedCount}</p>
              <p className="app-map-meta-note">Last synced 30s ago</p>
            </div>
            <div className="app-map-meta-card">
              <p className="app-map-meta-label">Affected barangays</p>
              <p className="app-map-meta-value">{affectedBarangays}</p>
              <p className="app-map-meta-note">Mapped from backend reports</p>
            </div>
          </div>
        </header>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="app-map-card">
          <div className="app-map-stage">
            <div ref={mapContainerRef} className="app-map-canvas" />

            <div className="app-map-overlay app-map-overlay--legend app-map-overlay--compact">
              <p className="app-map-panel-title">Legend</p>
              <p className="app-map-panel-value">Disaster layers</p>
              <p className="app-map-panel-copy">
                Circle size reflects the rough impact area, while color maps to the hazard type.
              </p>

              <div className="app-map-legend">
                {legendItems.map((item) => (
                  <div key={item.label} className="app-map-legend-item">
                    <div className="app-map-legend-left">
                      <span className={`app-map-legend-swatch ${toneClassMap[item.tone]}`} />
                      <div>
                        <p className="app-map-legend-label">{item.label}</p>
                        <p className="app-map-legend-count">{item.subtitle}</p>
                      </div>
                    </div>
                    <span className="app-map-legend-count">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="app-map-overlay app-map-overlay--info app-map-overlay--compact">
              <p className="app-map-panel-title">Live status</p>
              <p className="app-map-panel-value">Iloilo City</p>
              <p className="app-map-panel-copy">
                Flood signals are concentrated in the east, while thermal and slope alerts remain active in the west.
              </p>

              <div className="app-map-chip-row">
                <span className="app-map-chip app-map-chip--blue">High confidence</span>
                <span className="app-map-chip app-map-chip--orange">Patrol routing</span>
                <span className="app-map-chip app-map-chip--red">Dispatch ready</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
