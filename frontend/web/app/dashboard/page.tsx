"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  confidenceLabel,
  fetchReports,
  normalizeDisasterLabel,
  normalizeStatusLabel,
  type BackendReport,
} from "@/lib/api";

type SummaryCard = {
  label: string;
  value: string;
  delta: string;
  tone: "red" | "orange" | "green";
};

type ReportRow = {
  type: string;
  location: string;
  confidence: string;
  source: string;
  status: string;
  tone: "red" | "orange" | "green" | "blue";
};

type ActivityItem = {
  message: string;
  time: string;
  tone: "warning" | "success" | "info";
};

function toneFromStatus(status: string): ReportRow["tone"] {
  if (status === "resolved" || status === "verified") {
    return "green";
  }

  if (status === "responding") {
    return "blue";
  }

  if (status === "unverified") {
    return "orange";
  }

  return "red";
}

function formatRelative(isoDate: string | null): string {
  if (!isoDate) {
    return "Unknown";
  }

  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) {
    return "Unknown";
  }

  const deltaMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const hours = Math.floor(deltaMinutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const chartTheme = {
  axisStroke: "rgba(255,255,255,0.35)",
  gridStroke: "rgba(255,255,255,0.08)",
  lineMargin: { top: 10, right: 16, left: 0, bottom: 0 },
} as const;

const reportSeries = [
  { dataKey: "reports", stroke: "#ff2b2b" },
  { dataKey: "resolved", stroke: "#27e84f" },
] as const;

const toneMap = {
  red: "app-tone-pill app-tone-pill--red",
  orange: "app-tone-pill app-tone-pill--orange",
  green: "app-tone-pill app-tone-pill--green",
  blue: "app-tone-pill app-tone-pill--blue",
  warning: "app-tone-pill app-tone-pill--red",
  success: "app-tone-pill app-tone-pill--green",
  info: "app-tone-pill app-tone-pill--blue",
} as const;

function Pill({ tone, children }: { tone: keyof typeof toneMap; children: string }) {
  return (
    <span className={toneMap[tone]}>
      {children}
    </span>
  );
}

function ChartTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: Array<{ name?: string; value?: number }> }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="app-chart-tooltip">
      <p className="app-chart-tooltip-label">{label}</p>
      <div className="app-chart-tooltip-list">
        {payload.map((entry) => (
          <div key={entry.name} className="app-chart-tooltip-item">
            <span>{entry.name}</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryIcon({ tone }: { tone: SummaryCard["tone"] }) {
  return (
    <span className={`app-summary-badge app-summary-badge--${tone}`}>
      <span className="app-summary-badge-mark" />
    </span>
  );
}

function ActivityIcon({ tone }: { tone: ActivityItem["tone"] }) {
  return <span className={`app-activity-icon app-activity-icon--${tone === "warning" ? "red" : tone === "success" ? "green" : "blue"}`} />;
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="app-chart-card">
      <h2 className="app-chart-title">{title}</h2>
      {children}
    </article>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState<BackendReport[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const payload = await fetchReports();
        if (!active) {
          return;
        }
        setReports(payload);
      } catch (error) {
        if (!active) {
          return;
        }
        setLoadError(error instanceof Error ? error.message : "Failed to load dashboard data");
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const summaryCards = useMemo<SummaryCard[]>(() => {
    const verified = reports.filter((report) => report.status === "verified" || report.status === "resolved").length;
    const highConfidence = reports.filter((report) => report.confidence >= 70).length;

    return [
      { label: "Active Reports", value: String(reports.length), delta: "Live from backend", tone: "red" },
      {
        label: "High Confidence",
        value: String(highConfidence),
        delta: reports.length ? `${Math.round((highConfidence / reports.length) * 100)}% rate` : "0% rate",
        tone: "orange",
      },
      { label: "Verified", value: String(verified), delta: "Resolved or verified", tone: "green" },
    ];
  }, [reports]);

  const reportRows = useMemo<ReportRow[]>(() => {
    return reports.slice(0, 8).map((report) => ({
      type: normalizeDisasterLabel(report.disaster_type),
      location: report.barangay,
      confidence: confidenceLabel(report.confidence),
      source: report.source.toUpperCase(),
      status: normalizeStatusLabel(report.status),
      tone: toneFromStatus(report.status),
    }));
  }, [reports]);

  const activityItems = useMemo<ActivityItem[]>(() => {
    return reports.slice(0, 6).map((report) => ({
      message: `${normalizeDisasterLabel(report.disaster_type)} report in ${report.barangay} is ${normalizeStatusLabel(report.status).toLowerCase()}`,
      time: formatRelative(report.created_at),
      tone: report.status === "verified" || report.status === "resolved" ? "success" : report.status === "responding" ? "info" : "warning",
    }));
  }, [reports]);

  const lineData = useMemo(() => {
    const buckets = Array.from({ length: 8 }, (_, index) => {
      const hour = (new Date().getHours() - (7 - index) + 24) % 24;
      return {
        hour,
        name: `${hour}:00`,
        reports: 0,
        resolved: 0,
      };
    });

    reports.forEach((report) => {
      if (!report.created_at) {
        return;
      }

      const hour = new Date(report.created_at).getHours();
      const bucket = buckets.find((item) => item.hour === hour);

      if (!bucket) {
        return;
      }

      bucket.reports += 1;
      if (report.status === "resolved" || report.status === "verified") {
        bucket.resolved += 1;
      }
    });

    return buckets.map((bucket) => ({
      name: bucket.name,
      reports: bucket.reports,
      resolved: bucket.resolved,
    }));
  }, [reports]);

  const disasterData = useMemo(() => {
    const counts = new Map<string, number>();

    reports.forEach((report) => {
      const label = normalizeDisasterLabel(report.disaster_type);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });

    const palette = [
      { color: "#ff3b30", tone: "red" as const },
      { color: "#27e84f", tone: "green" as const },
      { color: "#3b82f6", tone: "blue" as const },
      { color: "#f59e0b", tone: "red" as const },
      { color: "#a855f7", tone: "green" as const },
      { color: "#14b8a6", tone: "blue" as const },
    ];

    const entries = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({
        name,
        value,
        color: palette[index % palette.length]?.color ?? "#94a3b8",
        tone: palette[index % palette.length]?.tone ?? "blue",
      }));

    return entries.length ? entries : [{ name: "No Data", value: 1, color: "#64748b", tone: "blue" as const }];
  }, [reports]);

  return (
    <div className="app-page">
      <div className="app-dashboard-grid">
        {loadError ? (
          <section className="app-card">
            <h2 className="app-card-title">Backend Connection Error</h2>
            <p className="app-card-body">{loadError}</p>
          </section>
        ) : null}

        <section className="app-summary-grid">
          {summaryCards.map((card) => (
            <article key={card.label} className="app-summary-card">
              <div className="app-summary-content">
                <div>
                  <p className="app-summary-title">{card.label}</p>
                  <p className="app-summary-value">{card.value}</p>
                  <p className="app-summary-delta">{card.delta}</p>
                </div>
                <SummaryIcon tone={card.tone} />
              </div>
            </article>
          ))}
        </section>

        <section className="app-chart-grid">
          <div className="xl:col-span-2">
            <ChartCard title="Reports Over Time">
              <div className="app-chart-area">
                {chartsReady ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={chartTheme.lineMargin}>
                      <CartesianGrid stroke={chartTheme.gridStroke} vertical={false} />
                      <XAxis dataKey="name" stroke={chartTheme.axisStroke} tickLine={false} axisLine={false} />
                      <YAxis stroke={chartTheme.axisStroke} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      {reportSeries.map((series) => (
                        <Line
                          key={series.dataKey}
                          type="monotone"
                          dataKey={series.dataKey}
                          stroke={series.stroke}
                          strokeWidth={3}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="app-card-body">Preparing chart...</div>
                )}
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Disaster Types">
            <div className="app-donut-layout">
              <div className="app-donut-plot">
                {chartsReady ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={disasterData} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2}>
                        {disasterData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="app-card-body">Preparing chart...</div>
                )}
              </div>
              <div className="app-donut-legend">
                {disasterData.map((item) => (
                  <div key={item.name} className="app-donut-legend-item">
                    <span className={`app-donut-legend-dot app-donut-legend-dot--${item.tone}`} />
                    <span>{item.name}</span>
                    <span className="app-donut-legend-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="app-report-card xl:col-span-2">
            <div className="border-b border-white/8 px-5 py-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300/80">Recent Reports</h2>
            </div>
            <div className="app-report-table-wrap">
              <table className="app-report-table">
                <thead>
                  <tr className="app-report-head-row">
                    <th className="app-report-head">Type</th>
                    <th className="app-report-head">Location</th>
                    <th className="app-report-head">Confidence</th>
                    <th className="app-report-head">Source</th>
                    <th className="app-report-head">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportRows.map((row) => (
                    <tr key={`${row.type}-${row.location}-${row.source}`} className="app-report-row">
                      <td className="app-report-cell-type">
                        <span className={`app-tone-pill ${toneMap[row.tone].replace("app-tone-pill ", "")}`}>{row.type}</span>
                      </td>
                      <td className="app-report-cell-text">{row.location}</td>
                      <td className="app-report-cell-type"><Pill tone={row.tone}>{row.confidence}</Pill></td>
                      <td className="app-report-cell-type"><Pill tone={row.tone}>{row.source}</Pill></td>
                      <td className="app-report-cell-type"><Pill tone={row.tone}>{row.status}</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="app-activity-panel">
            <div className="border-b border-white/8 px-5 py-4">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300/80">Live Activity</h2>
            </div>
            <div className="app-activity-panel-body">
              {activityItems.map((item) => (
                <div key={`${item.message}-${item.time}`} className="flex gap-3">
                  <ActivityIcon tone={item.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="app-activity-text">{item.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
