"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, QrCode, User, LucideIcon } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/history", label: "History", icon: Clock },
  { href: "/receive", label: "Receive", icon: QrCode },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-phone border-t border-border/70 bg-base/80 backdrop-blur-xl lg:absolute">
      <div className="flex items-center justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 active:scale-95 transition-transform"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 2}
                className={active ? "text-accent" : "text-tertiary"}
              />
              <span
                className={`text-[10px] font-medium tracking-tight ${
                  active ? "text-accent" : "text-tertiary"
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`h-1 w-1 rounded-full ${
                  active ? "bg-accent" : "bg-transparent"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
