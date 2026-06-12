"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Check, ChevronDown, User } from "lucide-react";
import {
  wallets,
  recentContacts,
  currencySymbol,
  type CurrencyCode,
} from "@/lib/data";

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("GBP");
  const [pickerOpen, setPickerOpen] = useState(false);

  const symbol = currencySymbol[currency];
  const numericAmount = parseFloat(amount || "0");

  const close = () => router.push("/dashboard");
  const back = () => (step === 0 ? close() : setStep((s) => s - 1));

  const canContinue =
    (step === 0 && recipient.trim().length > 1) ||
    (step === 1 && numericAmount > 0);

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
            onClick={back}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95"
          >
            {step === 0 ? (
              <X size={20} className="text-primary" />
            ) : (
              <ArrowLeft size={20} className="text-primary" />
            )}
          </button>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i <= step ? "w-6 bg-accent" : "w-6 bg-border"
                }`}
              />
            ))}
          </div>
          <div className="h-10 w-10" />
        </div>

        <div className="flex-1 px-5 pt-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="recipient"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h1 className="text-2xl font-bold tracking-tightest text-primary">
                  Send to
                </h1>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Name, @handle or account"
                  className="mt-5 h-14 w-full rounded-xl border border-border bg-surface px-4 text-base text-primary placeholder:text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <p className="mb-3 mt-7 text-sm font-medium text-secondary">
                  Recent
                </p>
                <div className="no-scrollbar flex gap-4 overflow-x-auto">
                  {recentContacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setRecipient(c.name)}
                      className="flex shrink-0 flex-col items-center gap-2 active:scale-95"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-elevated font-medium text-primary ring-1 ring-white/5">
                        {c.initials}
                      </span>
                      <span className="text-xs text-secondary">{c.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h1 className="text-2xl font-bold tracking-tightest text-primary">
                  Amount
                </h1>
                <p className="mt-1 text-sm text-secondary">To {recipient}</p>

                <div className="mt-10 flex items-center justify-center gap-1">
                  <span className="font-mono text-4xl font-medium text-secondary">
                    {symbol}
                  </span>
                  <input
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    inputMode="decimal"
                    placeholder="0"
                    autoFocus
                    className="w-44 bg-transparent text-center font-mono text-5xl font-medium text-primary placeholder:text-tertiary outline-none"
                  />
                </div>

                {/* Currency picker */}
                <div className="relative mx-auto mt-8 w-fit">
                  <button
                    onClick={() => setPickerOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium text-primary active:scale-95"
                  >
                    <span className="font-mono">{currency}</span>
                    <ChevronDown size={16} className="text-secondary" />
                  </button>
                  {pickerOpen && (
                    <div className="absolute left-1/2 z-20 mt-2 w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-elevated">
                      {wallets.map((w) => (
                        <button
                          key={w.currency}
                          onClick={() => {
                            setCurrency(w.currency);
                            setPickerOpen(false);
                          }}
                          className="flex w-full items-center justify-between px-4 py-3 text-sm text-primary hover:bg-white/5"
                        >
                          <span className="font-mono">{w.currency}</span>
                          <span className="font-mono text-xs text-secondary">
                            {w.symbol}
                            {w.balance.toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <h1 className="text-2xl font-bold tracking-tightest text-primary">
                  Confirm
                </h1>

                <div className="mt-6 rounded-2xl bg-surface p-5">
                  <div className="flex items-center gap-3 border-b border-border/60 pb-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-elevated">
                      <User size={20} className="text-secondary" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {recipient}
                      </p>
                      <p className="text-xs text-secondary">Recipient</p>
                    </div>
                  </div>
                  <Row label="Amount">
                    {symbol}
                    {numericAmount.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                    })}
                  </Row>
                  <Row label="Fee">{symbol}0.00</Row>
                  <Row label="Currency">{currency}</Row>
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-sm text-secondary">Total</span>
                    <span className="font-mono text-base font-medium text-primary">
                      {symbol}
                      {numericAmount.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center pt-20"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30"
                >
                  <Check size={40} className="text-success" strokeWidth={3} />
                </motion.span>
                <h1 className="mt-6 text-2xl font-bold tracking-tightest text-primary">
                  Sent!
                </h1>
                <p className="mt-2 text-sm text-secondary">
                  {symbol}
                  {numericAmount.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  sent to {recipient}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer CTA */}
        <div className="px-5 pb-8">
          {step < 2 && (
            <button
              disabled={!canContinue}
              onClick={() => setStep((s) => s + 1)}
              className="h-14 w-full rounded-xl bg-accent text-base font-semibold text-[#0E1117] transition-all active:scale-[0.98] disabled:opacity-40"
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="h-14 w-full rounded-xl bg-accent text-base font-semibold text-[#0E1117] transition-all active:scale-[0.98]"
            >
              Send {symbol}
              {numericAmount.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
              })}
            </button>
          )}
          {step === 3 && (
            <button
              onClick={close}
              className="h-14 w-full rounded-xl bg-surface text-base font-semibold text-primary transition-all active:scale-[0.98]"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-3">
      <span className="text-sm text-secondary">{label}</span>
      <span className="font-mono text-sm text-primary">{children}</span>
    </div>
  );
}
