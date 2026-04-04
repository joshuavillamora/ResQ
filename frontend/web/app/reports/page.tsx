"use client";

import { useEffect, useMemo, useState } from "react";

import {
  confidenceLabel,
  fetchReports,
  normalizeDisasterLabel,
  normalizeStatusLabel,
  type BackendReport,
} from "@/lib/api";

type ReportType = "Earthquake" | "Fire" | "Flood" | "Landslide" | "Typhoon" | "Medical Emergency" | "Volcano";
type ReportStatus = "Pending" | "Resolved" | "In Progress" | "Verified" | "False Report";
type ReportSource = "API" | "SMS";
type Confidence = "High" | "Medium" | "Low";

type Report = {
  id: string;
  type: ReportType;
  location: string;
  time: string;
  source: ReportSource;
  confidence: Confidence;
  status: ReportStatus;
};

const typeOptions: Array<"ALL TYPES" | ReportType> = [
  "ALL TYPES",
  "Earthquake",
  "Fire",
  "Flood",
  "Landslide",
  "Typhoon",
  "Medical Emergency",
  "Volcano",
];

const statusOptions: Array<"ALL STATUS" | ReportStatus> = ["ALL STATUS", "Pending", "Verified", "In Progress", "Resolved", "False Report"];

const typeColorMap: Record<ReportType, string> = {
  Earthquake: "app-tone-pill app-tone-pill--orange",
  Fire: "app-tone-pill app-tone-pill--red",
  Flood: "app-tone-pill app-tone-pill--blue",
  Landslide: "app-tone-pill app-tone-pill--green",
  Typhoon: "app-tone-pill app-tone-pill--orange",
  "Medical Emergency": "app-tone-pill app-tone-pill--red",
  Volcano: "app-tone-pill app-tone-pill--red",
};

const confidenceColorMap: Record<Confidence, string> = {
  High: "app-tone-pill app-tone-pill--green",
  Medium: "app-tone-pill app-tone-pill--orange",
  Low: "app-tone-pill app-tone-pill--red",
};

const statusColorMap: Record<ReportStatus, string> = {
  Pending: "app-tone-pill app-tone-pill--orange",
  Resolved: "app-tone-pill app-tone-pill--green",
  "In Progress": "app-tone-pill app-tone-pill--blue",
  Verified: "app-tone-pill app-tone-pill--green",
  "False Report": "app-tone-pill app-tone-pill--red",
};

function formatTime(isoDate: string | null): string {
  if (!isoDate) {
    return "Unknown";
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "Unknown";
  }

  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function mapBackendReport(report: BackendReport): Report {
  return {
    id: `RPT-${String(report.id).padStart(3, "0")}`,
    type: normalizeDisasterLabel(report.disaster_type) as ReportType,
    location: report.barangay,
    time: formatTime(report.created_at),
    source: report.source.toUpperCase() === "SMS" ? "SMS" : "API",
    confidence: confidenceLabel(report.confidence),
    status: normalizeStatusLabel(report.status) as ReportStatus,
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"ALL TYPES" | ReportType>("ALL TYPES");
  const [selectedStatus, setSelectedStatus] = useState<"ALL STATUS" | ReportStatus>("ALL STATUS");

  useEffect(() => {
    let isActive = true;

    const loadReports = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const backendReports = await fetchReports();

        if (!isActive) {
          return;
        }

        setReports(backendReports.map(mapBackendReport));
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "Failed to load reports from backend");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const typeMatch = selectedType === "ALL TYPES" || report.type === selectedType;
      const statusMatch = selectedStatus === "ALL STATUS" || report.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [reports, selectedStatus, selectedType]);

  return (
    <div className="app-page">
      <div className="app-page-inner app-reports-page">
        <section className="app-reports-toolbar">
          <div className="app-reports-filter-group">
            <svg
              className="app-reports-filter-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path d="M4 6H20L14 13V19L10 17V13L4 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <select
              id="type-filter"
              className="app-reports-filter-select app-reports-filter-select-compact"
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value as "ALL TYPES" | ReportType)}
              aria-label="Filter by report type"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              id="status-filter"
              className="app-reports-filter-select app-reports-filter-select-compact"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as "ALL STATUS" | ReportStatus)}
              aria-label="Filter by report status"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </section>

        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="app-report-card">
          <div className="app-report-table-wrap app-reports-table-wrap-tight">
            <table className="app-reports-table">
              <thead>
                <tr className="app-reports-head-row">
                  <th className="app-report-head">ID</th>
                  <th className="app-report-head">Type</th>
                  <th className="app-report-head">Location</th>
                  <th className="app-report-head">Time</th>
                  <th className="app-report-head">Source</th>
                  <th className="app-report-head">Confidence</th>
                  <th className="app-report-head">Status</th>
                  <th className="app-report-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="app-report-row">
                    <td className="app-reports-cell app-reports-id">{report.id}</td>
                    <td className="app-reports-cell">
                      <span className={typeColorMap[report.type]}>{report.type}</span>
                    </td>
                    <td className="app-reports-cell app-report-cell-text">{report.location}</td>
                    <td className="app-reports-cell">{report.time}</td>
                    <td className="app-reports-cell">
                      <span className={report.source === "API" ? "app-tone-pill app-tone-pill--blue" : "app-tone-pill app-tone-pill--orange"}>
                        {report.source}
                      </span>
                    </td>
                    <td className="app-reports-cell">
                      <span className={confidenceColorMap[report.confidence]}>{report.confidence}</span>
                    </td>
                    <td className="app-reports-cell">
                      <span className={statusColorMap[report.status]}>{report.status}</span>
                    </td>
                    <td className="app-reports-cell">
                      <button type="button" className="app-reports-action-button">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isLoading ? (
            <p className="app-reports-empty">Loading reports from backend...</p>
          ) : null}
          {filteredReports.length === 0 ? (
            <p className="app-reports-empty">No reports match the selected filters.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
