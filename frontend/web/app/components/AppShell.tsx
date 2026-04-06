"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/api";
import Sidebar from "./Sidebar";
import UniversalHeader from "./UniversalHeader";

type AppShellProps = {
  children: ReactNode;
};

const PUBLIC_ROUTES = new Set(["/"]);

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  const isPublicRoute = useMemo(() => PUBLIC_ROUTES.has(pathname), [pathname]);

  useEffect(() => {
    const user = getStoredUser();

    if (!user && !isPublicRoute) {
      router.replace("/");
      setIsReady(false);
      return;
    }

    if (user && isPublicRoute) {
      router.replace("/dashboard");
      setIsReady(false);
      return;
    }

    setIsReady(true);
  }, [isPublicRoute, router]);

  if (!isReady) {
    return <div className="app-auth-page" />;
  }

  if (isPublicRoute) {
    return <main className="app-main">{children}</main>;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <UniversalHeader />
        {children}
      </main>
    </div>
  );
}