"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  UserCog,
  Link2,
  ShieldCheck,
  Bell,
  Coins,
  Languages,
  KeyRound,
  Fingerprint,
  MonitorSmartphone,
  LifeBuoy,
  Flag,
  Star,
  LogOut,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { user } from "@/lib/data";

interface Item {
  label: string;
  icon: LucideIcon;
  slug: string;
}
interface Section {
  title: string;
  items: Item[];
}

const sections: Section[] = [
  {
    title: "Account",
    items: [
      { label: "Personal info", icon: UserCog, slug: "personal-info" },
      { label: "Linked accounts", icon: Link2, slug: "linked-accounts" },
      {
        label: "Limits & verification",
        icon: ShieldCheck,
        slug: "limits-verification",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Notifications", icon: Bell, slug: "notifications" },
      { label: "Default currency", icon: Coins, slug: "default-currency" },
      { label: "Language", icon: Languages, slug: "language" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Change PIN", icon: KeyRound, slug: "change-pin" },
      { label: "Biometrics", icon: Fingerprint, slug: "biometrics" },
      { label: "Active sessions", icon: MonitorSmartphone, slug: "active-sessions" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help centre", icon: LifeBuoy, slug: "help-centre" },
      { label: "Report a problem", icon: Flag, slug: "report-problem" },
      { label: "Rate the app", icon: Star, slug: "rate-app" },
    ],
  },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="px-5 pt-8">
        {/* Avatar header */}
        <div className="flex flex-col items-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-bold text-[#0E1117]">
            {user.initials}
          </span>
          <div className="mt-3 flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tightest text-primary">
              {user.name}
            </h1>
            <BadgeCheck size={18} className="text-accent" />
          </div>
          <p className="text-sm text-secondary">{user.email}</p>
        </div>

        {/* Sections */}
        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-tertiary">
                {section.title}
              </p>
              <div className="overflow-hidden rounded-2xl bg-surface">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={`/profile/${item.slug}`}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-white/5 ${
                        i > 0 ? "border-t border-border/50" : ""
                      }`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated">
                        <Icon size={18} className="text-secondary" />
                      </span>
                      <span className="flex-1 text-sm font-medium text-primary">
                        {item.label}
                      </span>
                      <ChevronRight size={18} className="text-tertiary" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={() => router.push("/login")}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-danger/30 text-base font-semibold text-danger active:scale-[0.98]"
        >
          <LogOut size={18} />
          Sign out
        </button>

        <p className="mt-6 text-center text-xs text-tertiary">
          Stash · Version 1.0.0
        </p>
      </div>
    </PageTransition>
  );
}
