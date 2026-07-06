"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, ArrowUpRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonList } from "@/components/SkeletonLoader";
import { PageTransition } from "@/components/PageTransition";
import { categoryMeta } from "@/components/categoryIcon";
import {
  transactions,
  formatAmount,
  type Transaction,
  type CurrencyCode,
  currencySymbol,
} from "@/lib/data";

/** Build a lookup map once for O(1) access by id. */
const txById = new Map<number, Transaction>(transactions.map((t) => [t.id, t]));

type Filter = "All" | "Received" | "Sent" | "Exchange" | "Fees";
const filters: Filter[] = ["All", "Received", "Sent", "Exchange", "Fees"];

type WalletTab = "All" | CurrencyCode;
const walletTabs: { label: string; value: WalletTab }[] = [
  { label: "All wallets", value: "All" },
  { label: `${currencySymbol.EUR} EUR`, value: "EUR" },
  { label: `${currencySymbol.GBP} GBP`, value: "GBP" },
  { label: `${currencySymbol.USD} USD`, value: "USD" },
];

function matchesFilter(tx: Transaction, filter: Filter): boolean {
  if (filter === "All") return true;
  if (filter === "Received")
    return tx.type === "credit" && tx.category !== "Exchange";
  if (filter === "Sent")
    return (
      tx.type === "debit" &&
      tx.category !== "Exchange" &&
      tx.category !== "Fees"
    );
  if (filter === "Exchange") return tx.category === "Exchange";
  if (filter === "Fees") return tx.category === "Fees";
  return true;
}

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [walletTab, setWalletTab] = useState<WalletTab>("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Reset filter & expanded when switching wallet tab
  const handleWalletTab = (tab: WalletTab) => {
    setWalletTab(tab);
    setExpanded(null);
    setQuery("");
  };

  const grouped = useMemo(() => {
    const filtered = transactions.filter(
      (tx) =>
        (walletTab === "All" || tx.currency === walletTab) &&
        matchesFilter(tx, filter) &&
        tx.merchant.toLowerCase().includes(query.toLowerCase())
    );
    const order: string[] = [];
    const map = new Map<string, Transaction[]>();
    for (const tx of filtered) {
      const key = tx.date === "Yesterday" ? "Yesterday" : tx.date;
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(tx);
    }
    return order.map((k) => ({
      date: k,
      items: map.get(k)!.slice().sort((a, b) => b.time.localeCompare(a.time)),
    }));
  }, [query, filter, walletTab]);

  return (
    <PageTransition>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface active:scale-95"
          >
            <ArrowLeft size={20} className="text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tightest text-primary">
            Transactions
          </h1>
        </div>

        {/* Wallet tabs */}
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {walletTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleWalletTab(tab.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${
                walletTab === tab.value
                  ? "bg-primary text-base"
                  : "bg-surface text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              walletTab === "All"
                ? "Search all transactions"
                : `Search ${walletTab} transactions`
            }
            className="h-12 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-primary placeholder:text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Filter chips */}
        <div className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors active:scale-95 ${
                filter === f
                  ? "bg-accent text-[#0E1117]"
                  : "bg-surface text-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-5">
          {loading ? (
            <SkeletonList rows={6} />
          ) : grouped.length === 0 ? (
            <p className="py-16 text-center text-sm text-secondary">
              No transactions found.
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.date} className="mb-5">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-tertiary">
                  {group.date}
                </p>
                <div className="divide-y divide-border/50">
                  {group.items.map((tx) => {
                    const meta = categoryMeta[tx.category];
                    const Icon = meta.icon;
                    const open = expanded === tx.id;
                    const isCredit = tx.type === "credit";
                    // Resolve related debit rows for credits
                    const relatedDebits =
                      isCredit && tx.relatedIds
                        ? tx.relatedIds
                            .map((id) => txById.get(id))
                            .filter((t): t is Transaction => !!t)
                        : [];
                    // For a debit: find its parent credit
                    const parentCredit =
                      !isCredit && tx.creditId
                        ? txById.get(tx.creditId)
                        : undefined;

                    return (
                      <div key={tx.id}>
                        <button
                          onClick={() => setExpanded(open ? null : tx.id)}
                          className="flex w-full items-center gap-3 py-3 text-left"
                        >
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.tint}`}
                          >
                            <Icon size={20} className={meta.fg} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-primary">
                              {tx.merchant}
                            </p>
                            <p className="truncate text-xs text-secondary">
                              {tx.time} · {tx.method}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-mono text-sm font-medium ${
                                isCredit ? "text-success" : "text-primary"
                              }`}
                            >
                              {isCredit ? "+" : "−"}
                              {formatAmount(tx.amount, tx.currency)}
                            </p>
                            <p className="text-[10px] text-tertiary">
                              {tx.currency}
                            </p>
                          </div>
                          <ChevronDown
                            size={16}
                            className={`text-tertiary transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mb-3 ml-14 space-y-2 rounded-xl bg-surface p-3.5">
                                <DetailRow label="Date & time">
                                  {tx.date} at {tx.time}
                                </DetailRow>
                                <DetailRow label="Reference">
                                  {tx.reference}
                                </DetailRow>
                                <DetailRow label="Status">
                                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                                    Success
                                  </span>
                                </DetailRow>
                                {tx.rate && (
                                  <DetailRow label="Exchange rate">
                                    {tx.rate}
                                  </DetailRow>
                                )}

                                {/* ── Spending trail for credits ── */}
                                {isCredit && relatedDebits.length > 0 && (
                                  <div className="mt-3 border-t border-border/50 pt-3">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-tertiary">
                                      Funded spending
                                    </p>
                                    <div className="space-y-2">
                                      {relatedDebits.map((debit) => {
                                        const dm =
                                          categoryMeta[debit.category];
                                        const DIcon = dm.icon;
                                        return (
                                          <div
                                            key={debit.id}
                                            className="flex items-center gap-2"
                                          >
                                            <span
                                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${dm.tint}`}
                                            >
                                              <DIcon
                                                size={13}
                                                className={dm.fg}
                                              />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                              <p className="truncate text-xs text-primary">
                                                {debit.merchant}
                                              </p>
                                              <p className="text-[10px] text-tertiary">
                                                {debit.time} · {debit.category}
                                              </p>
                                            </div>
                                            <p className="font-mono text-xs text-primary">
                                              −
                                              {formatAmount(
                                                debit.amount,
                                                debit.currency
                                              )}
                                            </p>
                                          </div>
                                        );
                                      })}
                                      {/* Net summary */}
                                      <div className="flex items-center justify-between border-t border-border/40 pt-2">
                                        <span className="text-[10px] text-tertiary">
                                          Net after spending
                                        </span>
                                        <span className="font-mono text-xs font-semibold text-success">
                                          +
                                          {formatAmount(
                                            tx.amount +
                                              relatedDebits.reduce(
                                                (s, d) => s + d.amount,
                                                0
                                              ),
                                            tx.currency
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* ── Parent credit for debits ── */}
                                {!isCredit && parentCredit && (
                                  <div className="mt-3 border-t border-border/50 pt-3">
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-tertiary">
                                      Funded by
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/15">
                                        <ArrowUpRight
                                          size={13}
                                          className="text-success"
                                        />
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-primary">
                                          {parentCredit.merchant}
                                        </p>
                                        <p className="text-[10px] text-tertiary">
                                          {parentCredit.date} ·{" "}
                                          {parentCredit.time}
                                        </p>
                                      </div>
                                      <p className="font-mono text-xs text-success">
                                        +
                                        {formatAmount(
                                          parentCredit.amount,
                                          parentCredit.currency
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-secondary">{label}</span>
      <span className="font-mono text-xs text-primary">{children}</span>
    </div>
  );
}
