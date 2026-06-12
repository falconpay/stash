"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function QuickAction({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center gap-2 active:scale-95 transition-transform"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-elevated ring-1 ring-white/5">
        <Icon size={22} className="text-accent" />
      </span>
      <span className="text-xs text-secondary">{label}</span>
    </Link>
  );
}
