"use client";

import Link from "next/link";
import { useState } from "react";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard"},
  { label: "Reports", href: "/reports"},
  { label: "Map", href: "/map"},
  { label: "Responders", href: "/responders"},
  { label: "Settings", href: "/settings"},
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

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
          <h1 className="app-sidebar-title">ResQ</h1>
          <p className="app-sidebar-subtitle">Admin Portal</p>
        </div>

        {/* Navigation */}
        <nav className="app-sidebar-nav">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="app-sidebar-link"
            >
              <span className="app-sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="app-sidebar-footer">
          <div className="app-sidebar-footer-inner">
            <button className="app-sidebar-link w-full justify-start py-2 text-left text-xs text-[#a8bce8] hover:text-white">
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
