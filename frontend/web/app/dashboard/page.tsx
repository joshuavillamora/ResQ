"use client";

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

const summaryCards: SummaryCard[] = [
  { label: "Active Reports", value: "11", delta: "+3 today", tone: "red" },
  { label: "High Confidence", value: "7", delta: "67% rate", tone: "orange" },
  { label: "Verified", value: "5", delta: "+3 today", tone: "green" },
];

const reportRows: ReportRow[] = [
  { type: "Earthquake", location: "Brgy. Tondo, Manila", confidence: "High", source: "SMS", status: "Pending", tone: "orange" },
  { type: "Fire", location: "Brgy. Tondo, Manila", confidence: "Medium", source: "Manual", status: "Resolved", tone: "red" },
  { type: "Flood", location: "Brgy. Tondo, Manila", confidence: "Low", source: "SMS", status: "In Progress", tone: "blue" },
  { type: "Landslide", location: "Brgy. Tondo, Manila", confidence: "High", source: "WIS", status: "Pending", tone: "green" },
  { type: "Flood", location: "Brgy. Tondo, Manila", confidence: "Medium", source: "WIS", status: "Resolved", tone: "red" },
  { type: "Typhoon", location: "Brgy. Tondo, Manila", confidence: "Low", source: "SMS", status: "In Progress", tone: "orange" },
  { type: "Earthquake", location: "Brgy. Tondo, Manila", confidence: "High", source: "WIS", status: "Pending", tone: "orange" },
  { type: "Fire", location: "Brgy. Tondo, Manila", confidence: "Medium", source: "SMS", status: "Resolved", tone: "green" },
];

const activityItems: ActivityItem[] = [
  { message: "New fire report received from Brgy. Tondo, Manila", time: "11:10 PM", tone: "warning" },
  { message: "RPT-001 verified by crowd consensus (7 reports)", time: "10:45 PM", tone: "success" },
  { message: "Cap. Del Cruz deployed to RPT-001", time: "10:40 PM", tone: "info" },
  { message: "Flood warning issued for Quezon City area", time: "10:30 PM", tone: "warning" },
  { message: "New SMS report received from Brgy. Tondo, Manila", time: "10:15 PM", tone: "warning" },
  { message: "RPT-001 verified by crowd consensus (7 reports)", time: "10:05 PM", tone: "success" },
];

const lineData = [
  { name: "6AM", reports: 2, resolved: 1 },
  { name: "8AM", reports: 4, resolved: 2 },
  { name: "10AM", reports: 6, resolved: 4 },
  { name: "12PM", reports: 7, resolved: 5 },
  { name: "2PM", reports: 8, resolved: 5 },
  { name: "4PM", reports: 8, resolved: 6 },
  { name: "6PM", reports: 9, resolved: 6 },
  { name: "8PM", reports: 10, resolved: 7 },
  { name: "10PM", reports: 11, resolved: 8 },
];

const disasterData = [
  { name: "Fire", value: 10, color: "#ff3b30", tone: "red" },
  { name: "Typhoon", value: 4, color: "#27e84f", tone: "green" },
  { name: "Flood", value: 3, color: "#3b82f6", tone: "blue" },
];

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
  return (
    <div className="app-page">
      <div className="app-dashboard-grid">
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
              </div>
            </ChartCard>
          </div>

          <ChartCard title="Disaster Types">
            <div className="app-donut-layout">
              <div className="app-donut-plot">
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