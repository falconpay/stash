"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

const NO_NAV_ROUTES = ["/login", "/otp", "/", "/send", "/exchange"];

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !NO_NAV_ROUTES.includes(pathname);

  return (
    <div className="relative w-full max-w-phone">
      <div
        className="relative min-h-[100dvh] overflow-hidden bg-base sm:my-6 sm:min-h-[860px] sm:rounded-[2.5rem] sm:border sm:border-white/5"
        style={{
          boxShadow:
            "0 40px 120px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div className="relative flex min-h-[100dvh] flex-col sm:min-h-[860px]">
          <main className={`flex-1 ${showNav ? "pb-24" : ""}`}>{children}</main>
          {showNav && <BottomNav />}
        </div>
      </div>
    </div>
  );
}
