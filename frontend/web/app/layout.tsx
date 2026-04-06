import "./globals.css";
import AppShell from "./components/AppShell";

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem("resq_theme_preference") || "system";
                  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var resolved = stored === "system" ? (prefersDark ? "dark" : "light") : stored;
                  document.documentElement.classList.remove("theme-dark", "theme-light");
                  document.documentElement.classList.add("theme-" + resolved);
                } catch (_error) {
                  document.documentElement.classList.add("theme-dark");
                }
              })();
            `,
          }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
