import "./globals.css";
import Sidebar from "./components/Sidebar";
import UniversalHeader from "./components/UniversalHeader";

export const metadata = {
  title: "ResQ - Admin Portal",
  description: "Emergency response management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="app-main">
            <UniversalHeader />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
