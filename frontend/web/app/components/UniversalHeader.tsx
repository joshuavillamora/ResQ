"use client";

import { usePathname } from "next/navigation";

const pageNames: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/reports": "Reports",
  "/map": "Map",
  "/responders": "Responders",
  "/settings": "Settings",
};

function toTitleFromPath(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean).at(-1) || "home";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function UniversalHeader() {
  const pathname = usePathname();
  const title = pageNames[pathname] ?? toTitleFromPath(pathname);

  return (
    <header className="app-header">
      <h1 className="app-header-title">{title}</h1>
    </header>
  );
}
