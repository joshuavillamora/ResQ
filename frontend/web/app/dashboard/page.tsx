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
    <article className="rounded-lg border border-[rgba(168,198,238,0.1)] bg-[#24374f] p-6">
      <p className="text-sm font-medium text-[#a8bce8]">{label}</p>
      <h2 className="mt-2 text-4xl font-bold text-white">{value}</h2>
      <p className="mt-2 text-xs text-[#7a9fcf]">{detail}</p>
    </article>
  );
}

function ActivityRow({ event, location, time }: Activity) {
  return (
    <div className="flex items-start gap-3 border-b border-[rgba(190,215,255,0.12)] pb-3 last:border-b-0">
      <span className="mt-2 h-2 w-2 rounded-full bg-[#35ff32]" aria-hidden />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{event}</p>
        <p className="text-xs text-[#a8bce8]">{location}</p>
      </div>
      <span className="text-xs text-[#7a9fcf]">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-6 pt-16 md:p-8 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-[#a8bce8]">Welcome back to the ResQ Admin Portal</p>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-lg border border-[rgba(168,198,238,0.1)] bg-[#24374f] p-6 xl:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-white">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityRow key={`${activity.event}-${activity.time}`} {...activity} />
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[rgba(168,198,238,0.1)] bg-[#24374f] p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
            <div className="space-y-3">
              {actions.map((action) => (
                <button
                  key={action}
                  className="w-full rounded-lg bg-[#2f4766] px-4 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-[#3d5a8a]"
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
