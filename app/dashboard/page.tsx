"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Grid2x2,
} from "lucide-react";
import { WalletCard } from "@/components/WalletCard";
import { QuickAction } from "@/components/QuickAction";
import { TransactionRow } from "@/components/TransactionRow";
import { SkeletonCard, SkeletonList } from "@/components/SkeletonLoader";
import { PageTransition } from "@/components/PageTransition";
import {
  wallets,
  transactions,
  user,
  convert,
  defaultCurrency,
  formatAmount,
} from "@/lib/data";

// Date ordering for sorting (most recent first)
const DATE_ORDER: Record<string, number> = { Today: 0, Yesterday: 1 };
function dateSortKey(date: string): number {
  if (date in DATE_ORDER) return DATE_ORDER[date];
  // Parse "Jul 4", "Jun 30", etc. — assign higher numbers for older dates
  const parsed = new Date(`${date} 2026`);
  if (!isNaN(parsed.getTime())) {
    // Days before today (Jul 8 2026)
    const today = new Date("Jul 8 2026");
    return Math.ceil((today.getTime() - parsed.getTime()) / 86400000);
  }
  return 999;
}

const recentTransactions = [...transactions]
  .sort((a, b) => {
    const dateDiff = dateSortKey(a.date) - dateSortKey(b.date);
    if (dateDiff !== 0) return dateDiff;
    return b.time.localeCompare(a.time);
  })
  .slice(0, 5);

const totalBalance = wallets.reduce(
  (sum, w) => sum + convert(w.balance, w.currency, defaultCurrency),
  0
);

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [hideBalance, setHideBalance] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(idx);
  };

  return (
    <PageTransition>
      <div className="px-5 pt-6">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-semibold text-[#0E1117] active:scale-95"
          >
            {user.initials}
          </Link>
          <div className="text-center">
            <p className="text-xs text-secondary">{greeting()},</p>
            <p className="text-sm font-semibold text-primary">
              {user.firstName}
            </p>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95">
            <Bell size={20} className="text-primary" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-base" />
          </button>
        </header>

        {/* Total balance */}
        <section className="mt-7 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-sm text-secondary">Total balance</p>
            <button
              onClick={() => setHideBalance((v) => !v)}
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
              className="flex h-6 w-6 items-center justify-center rounded-full text-secondary active:scale-90"
            >
              {hideBalance ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="mt-1.5 font-mono text-[2.75rem] font-semibold leading-none tracking-tight text-primary">
            {hideBalance ? (
              <span className="tracking-widest">••••••</span>
            ) : (
              formatAmount(totalBalance, defaultCurrency)
            )}
          </p>
          <p className="mt-2 text-xs text-tertiary">
            in {defaultCurrency} · default currency · mid-market rate
          </p>
        </section>

        {/* Wallet cards */}
        <section className="mt-7">
          {loading ? (
            <SkeletonCard />
          ) : (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
            >
              {wallets.map((w) => (
                <div key={w.currency} className="w-[calc(100%-1.5rem)] shrink-0">
                  <WalletCard wallet={w} hidden={hideBalance} />
                </div>
              ))}
            </div>
          )}

          {/* Dots */}
          {!loading && (
            <div className="mt-4 flex justify-center gap-1.5">
              {wallets.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-accent" : "w-1.5 bg-tertiary"
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="mt-6 flex gap-3">
          <QuickAction icon={ArrowUpRight} label="Send" href="/send" />
          <QuickAction icon={ArrowDownLeft} label="Receive" href="/receive" />
          <QuickAction icon={ArrowLeftRight} label="Exchange" href="/exchange" />
          <QuickAction icon={Grid2x2} label="More" href="/profile" />
        </section>

        {/* Recent */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-primary">
              Recent
            </h2>
            <Link href="/history" className="text-sm font-medium text-accent">
              See all
            </Link>
          </div>

          <div className="mt-1 divide-y divide-border/50">
            {loading ? (
              <SkeletonList rows={5} />
            ) : (
              recentTransactions
                .map((tx) => <TransactionRow key={tx.id} tx={tx} />)
            )}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
