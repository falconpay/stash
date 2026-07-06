"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Share2, Info } from "lucide-react";
import { CurrencyTab } from "@/components/CurrencyTab";
import { PageTransition } from "@/components/PageTransition";
import { wallets, type CurrencyCode } from "@/lib/data";

export default function ReceivePage() {
  const router = useRouter();
  const [active, setActive] = useState<CurrencyCode>("GBP");
  const [copied, setCopied] = useState<string | null>(null);

  const wallet = wallets.find((w) => w.currency === active)!;

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const fields: { label: string; value: string; copyable?: boolean }[] = [
    { label: "Account name", value: wallet.holder },
  ];
  if (wallet.accountNo)
    fields.push({
      label: "Account number",
      value: wallet.accountNo,
      copyable: true,
    });
  if (wallet.sortCode)
    fields.push({ label: "Sort code", value: wallet.sortCode, copyable: true });
  if (wallet.routing)
    fields.push({
      label: "Routing number",
      value: wallet.routing,
      copyable: true,
    });
  if (wallet.iban)
    fields.push({ label: "IBAN", value: wallet.iban, copyable: true });
  if (wallet.bic)
    fields.push({ label: "BIC / SWIFT", value: wallet.bic, copyable: true });
  fields.push({ label: "Bank", value: wallet.bank });

  return (
    <PageTransition>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95"
          >
            <ArrowLeft size={20} className="text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tightest text-primary">
            Receive
          </h1>
        </div>

        <div className="mt-6">
          <CurrencyTab
            options={["EUR", "GBP", "USD"]}
            active={active}
            onChange={setActive}
          />
        </div>

        {/* Account details */}
        <div className="mt-6 rounded-2xl border border-dashed border-border p-5">
          <p className="mb-1 text-xs uppercase tracking-wide text-tertiary">
            {wallet.name} account
          </p>
          <div className="divide-y divide-border/50">
            {fields.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between py-3.5"
              >
                <div className="min-w-0">
                  <p className="text-xs text-secondary">{f.label}</p>
                  <p className="mt-0.5 truncate font-mono text-sm text-primary">
                    {f.value}
                  </p>
                </div>
                {f.copyable && (
                  <button
                    onClick={() => copy(f.label, f.value)}
                    className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface active:scale-95"
                  >
                    {copied === f.label ? (
                      <Check size={16} className="text-success" />
                    ) : (
                      <Copy size={16} className="text-secondary" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {copied && (
          <p className="mt-3 text-center text-xs text-success">Copied!</p>
        )}

        {/* Info note */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-surface p-3.5">
          <Info size={16} className="mt-0.5 shrink-0 text-secondary" />
          <p className="text-xs leading-relaxed text-secondary">
            Transfers may take 1–2 business days to arrive depending on the
            sending bank.
          </p>
        </div>

        <button className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-[#0E1117] active:scale-[0.98]">
          <Share2 size={18} />
          Share details
        </button>
      </div>
    </PageTransition>
  );
}
