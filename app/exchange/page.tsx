"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpDown, ChevronDown, Check } from "lucide-react";
import {
  wallets,
  convert,
  rateLine,
  currencySymbol,
  type CurrencyCode,
} from "@/lib/data";

const codes: CurrencyCode[] = ["EUR", "GBP", "USD"];

export default function ExchangePage() {
  const router = useRouter();
  const [from, setFrom] = useState<CurrencyCode>("GBP");
  const [to, setTo] = useState<CurrencyCode>("EUR");
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState<"from" | "to" | null>(null);
  const [done, setDone] = useState(false);

  const fromWallet = wallets.find((w) => w.currency === from)!;
  const numeric = parseFloat(amount || "0");
  const converted = convert(numeric, from, to);
  const fromSymbol = currencySymbol[from];
  const toSymbol = currencySymbol[to];

  const canExchange = numeric > 0 && numeric <= fromWallet.balance;

  const fmt = (n: number) =>
    n.toLocaleString("en-GB", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Pick a currency for one side, keeping the two sides distinct.
  const pick = (side: "from" | "to", code: CurrencyCode) => {
    if (side === "from") {
      setFrom(code);
      if (code === to) setTo(codes.find((c) => c !== code)!);
    } else {
      setTo(code);
      if (code === from) setFrom(codes.find((c) => c !== code)!);
    }
    setOpen(null);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="relative min-h-[100dvh] sm:min-h-[860px]">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="flex min-h-[100dvh] flex-col bg-base sm:min-h-[860px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95"
          >
            <X size={20} className="text-primary" />
          </button>
          <h1 className="text-base font-semibold tracking-tight text-primary">
            Exchange
          </h1>
          <div className="h-10 w-10" />
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-1 flex-col items-center px-5 pt-20"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30"
            >
              <Check size={40} className="text-success" strokeWidth={3} />
            </motion.span>
            <h2 className="mt-6 text-2xl font-bold tracking-tightest text-primary">
              Exchanged!
            </h2>
            <p className="mt-2 font-mono text-sm text-secondary">
              {fromSymbol}
              {fmt(numeric)} → {toSymbol}
              {fmt(converted)}
            </p>
          </motion.div>
        ) : (
          <div className="flex-1 px-5 pt-8">
            {/* From */}
            <Panel
              label="From"
              code={from}
              open={open === "from"}
              onToggle={() => setOpen(open === "from" ? null : "from")}
              onPick={(c) => pick("from", c)}
            >
              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                }
                inputMode="decimal"
                placeholder="0.00"
                autoFocus
                className="w-full bg-transparent text-right font-mono text-3xl font-medium text-primary placeholder:text-tertiary outline-none"
              />
            </Panel>

            <p className="mt-2 px-1 text-xs text-secondary">
              Available {fromSymbol}
              {fmt(fromWallet.balance)}
              {numeric > fromWallet.balance && (
                <span className="ml-2 text-danger">Insufficient balance</span>
              )}
            </p>

            {/* Swap */}
            <div className="my-3 flex justify-center">
              <button
                onClick={swap}
                aria-label="Swap currencies"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated ring-1 ring-white/5 active:scale-90"
              >
                <ArrowUpDown size={18} className="text-accent" />
              </button>
            </div>

            {/* To */}
            <Panel
              label="To"
              code={to}
              open={open === "to"}
              onToggle={() => setOpen(open === "to" ? null : "to")}
              onPick={(c) => pick("to", c)}
            >
              <p className="w-full text-right font-mono text-3xl font-medium text-primary">
                {toSymbol}
                {fmt(converted)}
              </p>
            </Panel>

            {/* Rate */}
            <div className="mt-6 flex items-center justify-between rounded-xl bg-surface px-4 py-3">
              <span className="text-sm text-secondary">Exchange rate</span>
              <span className="font-mono text-sm text-primary">
                {rateLine(from, to)}
              </span>
            </div>
            <p className="mt-2 px-1 text-xs text-tertiary">
              Mid-market rate · no hidden fees
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 pb-8">
          {done ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="h-14 w-full rounded-xl bg-surface text-base font-semibold text-primary transition-all active:scale-[0.98]"
            >
              Done
            </button>
          ) : (
            <button
              disabled={!canExchange}
              onClick={() => setDone(true)}
              className="h-14 w-full rounded-xl bg-accent text-base font-semibold text-[#0E1117] transition-all active:scale-[0.98] disabled:opacity-40"
            >
              {numeric > 0
                ? `Exchange ${fromSymbol}${fmt(numeric)}`
                : "Enter an amount"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Panel({
  label,
  code,
  open,
  onToggle,
  onPick,
  children,
}: {
  label: string;
  code: CurrencyCode;
  open: boolean;
  onToggle: () => void;
  onPick: (c: CurrencyCode) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="mb-2 text-xs text-secondary">{label}</p>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <button
            onClick={onToggle}
            className="flex items-center gap-1.5 rounded-full bg-elevated px-3 py-2 active:scale-95"
          >
            <span className="font-mono text-sm font-medium text-primary">
              {code}
            </span>
            <ChevronDown size={15} className="text-secondary" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-20 mt-2 w-36 overflow-hidden rounded-xl border border-border bg-elevated"
              >
                {codes.map((c) => (
                  <button
                    key={c}
                    onClick={() => onPick(c)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm text-primary hover:bg-white/5"
                  >
                    <span className="font-mono">{c}</span>
                    {c === code && <Check size={15} className="text-accent" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {children}
      </div>
    </div>
  );
}
