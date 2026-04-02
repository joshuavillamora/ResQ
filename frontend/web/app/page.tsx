import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-6 pt-16 md:p-8 md:pt-8">
      <div className="mx-auto max-w-5xl rounded-xl border border-[rgba(168,198,238,0.1)] bg-[#24374f] p-8">
        <h1 className="mb-2 text-4xl font-bold text-white">ResQ Admin Portal</h1>
        <p className="mb-6 text-[#a8bce8]">Welcome. Use the navigation to open system modules.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[#2f4766] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d5a8a]"
          >
            Go To Dashboard
          </Link>
          <Link
            href="/reports"
            className="rounded-lg bg-[#2f4766] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d5a8a]"
          >
            View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
