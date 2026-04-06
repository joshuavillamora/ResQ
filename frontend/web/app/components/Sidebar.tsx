"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clearSession } from "@/lib/api";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard"},
  { label: "Reports", href: "/reports"},
  { label: "Map", href: "/map"},
  { label: "Settings", href: "/settings"},
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    setIsOpen(false);
    router.push("/");
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="app-sidebar-toggle"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside
        className={`app-sidebar ${isOpen ? "app-sidebar-open" : "app-sidebar-closed"} md:translate-x-0`}
      >
        {/* Brand */}
        <div className="app-sidebar-brand">
          <img
            src="/resq-header.png"
            alt="ResQ"
            className="app-sidebar-logo"
          />
          <p className="app-sidebar-subtitle">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="app-sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`app-sidebar-link ${pathname === item.href ? "app-sidebar-link-active" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              <span className="app-sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="app-sidebar-footer">
          <div className="app-sidebar-footer-inner">
            <button
              className="app-sidebar-link w-full justify-start py-2 text-left text-xs text-[#a8bce8] hover:text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="app-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
