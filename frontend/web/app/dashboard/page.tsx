type Stat = {
  label: string;
  value: string;
  detail: string;
};

type Activity = {
  event: string;
  location: string;
  time: string;
};

const stats: Stat[] = [
  { label: "Active Reports", value: "24", detail: "+5 this hour" },
  { label: "Verified", value: "18", detail: "75% verification rate" },
  { label: "Responders Online", value: "12", detail: "of 28 total" },
  { label: "Response Time (avg)", value: "4.2m", detail: "Target: 5m" },
];

const activities: Activity[] = [
  { event: "New flood report", location: "Quezon City", time: "2 mins ago" },
  { event: "Report verified", location: "Manila", time: "5 mins ago" },
  { event: "Responder deployed", location: "Tondo", time: "8 mins ago" },
  { event: "Typhoon alert escalated", location: "Pasig", time: "14 mins ago" },
];

const actions = [
  "View All Reports",
  "Manage Responders",
  "View Live Map",
  "Generate Statistics",
];

function StatCard({ label, value, detail }: Stat) {
  return (
    <article className="app-card">
      <p className="app-stat-title">{label}</p>
      <h2 className="app-stat-value">{value}</h2>
      <p className="app-stat-detail">{detail}</p>
    </article>
  );
}

function ActivityRow({ event, location, time }: Activity) {
  return (
    <div className="app-activity-row">
      <span className="app-activity-dot" aria-hidden />
      <div className="app-activity-content">
        <p className="app-activity-event">{event}</p>
        <p className="app-activity-location">{location}</p>
      </div>
      <span className="app-activity-time">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="app-page">
      <div className="app-page-inner">
        <p className="app-hero-text">Welcome back to the ResQ Admin Portal</p>

        <section className="app-stat-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="app-activity-grid">
          <article className="app-activity-card">
            <h3 className="app-card-title">Recent Activity</h3>
            <div className="app-activity-list">
              {activities.map((activity) => (
                <ActivityRow key={`${activity.event}-${activity.time}`} {...activity} />
              ))}
            </div>
          </article>

          <article className="app-actions-card">
            <h3 className="app-card-title">Quick Actions</h3>
            <div className="app-actions-list">
              {actions.map((action) => (
                <button
                  key={action}
                  className="app-button"
                  type="button"
                >
                  {action}
                </button>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
