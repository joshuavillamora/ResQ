"use client";

import { useMemo, useState } from "react";

type ReportType = "Earthquake" | "Fire" | "Flood" | "Landslide" | "Volcano" | "Typhoon";
type ReportStatus = "Pending" | "Resolved" | "In Progress";
type ReportSource = "WiFi" | "SMS";
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

const reports: Report[] = [
  { id: "RPT-001", type: "Earthquake", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "WiFi", confidence: "High", status: "Pending" },
  { id: "RPT-002", type: "Fire", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "SMS", confidence: "Medium", status: "Resolved" },
  { id: "RPT-003", type: "Flood", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "SMS", confidence: "Low", status: "In Progress" },
  { id: "RPT-004", type: "Landslide", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "WiFi", confidence: "High", status: "Pending" },
  { id: "RPT-005", type: "Volcano", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "SMS", confidence: "Medium", status: "Resolved" },
  { id: "RPT-006", type: "Typhoon", location: "Brgy. Tondo, Manila", time: "10:34 AM", source: "SMS", confidence: "Low", status: "In Progress" },
];

const typeColorMap: Record<ReportType, string> = {
  Earthquake: "app-tone-pill app-tone-pill--orange",
  Fire: "app-tone-pill app-tone-pill--red",
  Flood: "app-tone-pill app-tone-pill--blue",
  Landslide: "app-tone-pill app-tone-pill--green",
  Volcano: "app-tone-pill app-tone-pill--red",
  Typhoon: "app-tone-pill app-tone-pill--blue",
};

const confidenceColorMap: Record<Confidence, string> = {
  High: "app-tone-pill app-tone-pill--green",
  Medium: "app-tone-pill app-tone-pill--orange",
  Low: "app-tone-pill app-tone-pill--red",
};

const statusColorMap: Record<ReportStatus, string> = {
  Pending: "app-tone-pill app-tone-pill--orange",
  Resolved: "app-tone-pill app-tone-pill--green",
  "In Progress": "app-tone-pill app-tone-pill--red",
};

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<"ALL TYPES" | ReportType>("ALL TYPES");
  const [selectedStatus, setSelectedStatus] = useState<"ALL STATUS" | ReportStatus>("ALL STATUS");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const typeMatch = selectedType === "ALL TYPES" || report.type === selectedType;
      const statusMatch = selectedStatus === "ALL STATUS" || report.status === selectedStatus;
      return typeMatch && statusMatch;
    });
  }, [selectedStatus, selectedType]);

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
              <option value="ALL TYPES">ALL TYPES</option>
              <option value="Earthquake">Earthquake</option>
              <option value="Fire">Fire</option>
              <option value="Flood">Flood</option>
              <option value="Landslide">Landslide</option>
              <option value="Volcano">Volcano</option>
              <option value="Typhoon">Typhoon</option>
            </select>
            <select
              id="status-filter"
              className="app-reports-filter-select app-reports-filter-select-compact"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value as "ALL STATUS" | ReportStatus)}
              aria-label="Filter by report status"
            >
              <option value="ALL STATUS">ALL STATUS</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </section>

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
                      <span className={report.source === "WiFi" ? "app-tone-pill app-tone-pill--blue" : "app-tone-pill app-tone-pill--orange"}>
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
          {filteredReports.length === 0 ? (
            <p className="app-reports-empty">No reports match the selected filters.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
