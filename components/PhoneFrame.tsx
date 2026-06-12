"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "./BottomNav";

const NO_NAV_ROUTES = ["/login", "/otp", "/", "/send", "/exchange"];

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = !NO_NAV_ROUTES.includes(pathname);

  return (
    // Mobile: full width & height, no frame.
    // Desktop (lg+): centered 430px "phone" with rounded frame + shadow.
    <div className="relative w-full lg:max-w-phone">
      <div className="relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-base lg:my-6 lg:min-h-[860px] lg:rounded-[2.5rem] lg:border lg:border-white/5 lg:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]">
        <main className={`flex-1 ${showNav ? "pb-24" : ""}`}>{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
