import Link from "next/link";

export default function HomePage() {
  return (
    <div className="app-page">
      <div className="app-page-inner-narrow app-hero-card">
        <h1 className="app-hero-title">ResQ Admin Portal</h1>
        <p className="app-hero-text">Welcome. Use the navigation to open system modules.</p>

        <div className="app-grid-2">
          <Link href="/dashboard" className="app-link-button">
            Go To Dashboard
          </Link>
          <Link href="/reports" className="app-link-button">
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
