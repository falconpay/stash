"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Star,
  CreditCard,
} from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { user, wallets } from "@/lib/data";

const titles: Record<string, string> = {
  "personal-info": "Personal info",
  "linked-accounts": "Linked accounts",
  "limits-verification": "Limits & verification",
  notifications: "Notifications",
  "default-currency": "Default currency",
  language: "Language",
  "change-pin": "Change PIN",
  biometrics: "Biometrics",
  "active-sessions": "Active sessions",
  "help-centre": "Help centre",
  "report-problem": "Report a problem",
  "rate-app": "Rate the app",
};

export default function SettingDetail() {
  const router = useRouter();
  const { slug } = useParams<{ slug: string }>();
  const title = titles[slug] ?? "Settings";

  return (
    <PageTransition>
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95"
          >
            <ArrowLeft size={20} className="text-primary" />
          </button>
          <h1 className="text-xl font-bold tracking-tightest text-primary">
            {title}
          </h1>
        </div>

        <div className="mt-6">
          <Body slug={slug} />
        </div>
      </div>
    </PageTransition>
  );
}

function Body({ slug }: { slug: string }) {
  switch (slug) {
    case "personal-info":
      return <PersonalInfo />;
    case "linked-accounts":
      return <LinkedAccounts />;
    case "limits-verification":
      return <Limits />;
    case "notifications":
      return <Notifications />;
    case "default-currency":
      return <DefaultCurrency />;
    case "language":
      return <Language />;
    case "change-pin":
      return <ChangePin />;
    case "biometrics":
      return <Biometrics />;
    case "active-sessions":
      return <Sessions />;
    case "help-centre":
      return <HelpCentre />;
    case "report-problem":
      return <ReportProblem />;
    case "rate-app":
      return <RateApp />;
    default:
      return (
        <p className="text-sm text-secondary">This setting is coming soon.</p>
      );
  }
}

/* ---------- shared bits ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface">{children}</div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5 last:border-b-0">
      <span className="text-sm text-secondary">{label}</span>
      <span className="font-mono text-sm text-primary">{value}</span>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-accent" : "bg-elevated"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
          on ? "left-[1.375rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function ToggleRow({
  label,
  sub,
  defaultOn = false,
}: {
  label: string;
  sub?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between border-b border-border/50 px-4 py-3.5 last:border-b-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-primary">{label}</p>
        {sub && <p className="text-xs text-secondary">{sub}</p>}
      </div>
      <Toggle on={on} onClick={() => setOn((v) => !v)} />
    </div>
  );
}

function RadioList({
  options,
  initial,
}: {
  options: { value: string; label: string; hint?: string }[];
  initial: string;
}) {
  const [selected, setSelected] = useState(initial);
  return (
    <Card>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setSelected(opt.value)}
          className="flex w-full items-center justify-between border-b border-border/50 px-4 py-3.5 text-left last:border-b-0 active:bg-white/5"
        >
          <div>
            <p className="text-sm font-medium text-primary">{opt.label}</p>
            {opt.hint && <p className="text-xs text-secondary">{opt.hint}</p>}
          </div>
          {selected === opt.value && (
            <Check size={18} className="text-accent" />
          )}
        </button>
      ))}
    </Card>
  );
}

/* ---------- per-setting bodies ---------- */

function PersonalInfo() {
  return (
    <Card>
      <FieldRow label="Full name" value={user.name} />
      <FieldRow label="Email" value={user.email} />
      <FieldRow label="Date of birth" value="14 Mar 1994" />
      <FieldRow label="Address" value="221B Baker St, London" />
      <FieldRow label="Nationality" value="Polish" />
    </Card>
  );
}

function LinkedAccounts() {
  const accounts = [
    { name: "Barclays Debit", sub: "•••• 7731", color: "text-[#bd9bff]" },
    { name: "Clear Junction", sub: "•••• 4421", color: "text-[#8fb0ff]" },
    { name: "Bank of America", sub: "•••• 9902", color: "text-[#7ee0a0]" },
  ];
  return (
    <>
      <Card>
        {accounts.map((a) => (
          <div
            key={a.sub}
            className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5 last:border-b-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated">
              <CreditCard size={18} className={a.color} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">{a.name}</p>
              <p className="font-mono text-xs text-secondary">{a.sub}</p>
            </div>
            <ChevronRight size={18} className="text-tertiary" />
          </div>
        ))}
      </Card>
      <button className="mt-4 h-12 w-full rounded-xl border border-border text-sm font-semibold text-accent active:scale-[0.98]">
        + Link new account
      </button>
    </>
  );
}

function Limits() {
  const limits = [
    { label: "Monthly spending", used: 1240, max: 5000, cur: "£" },
    { label: "Daily transfers", used: 120, max: 2000, cur: "£" },
    { label: "ATM withdrawals", used: 60, max: 500, cur: "£" },
  ];
  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl bg-success/10 p-4 ring-1 ring-success/20">
        <ShieldCheck size={22} className="text-success" />
        <div>
          <p className="text-sm font-semibold text-primary">Verified account</p>
          <p className="text-xs text-secondary">
            Identity confirmed · full limits unlocked
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-4">
        {limits.map((l) => {
          const pct = Math.round((l.used / l.max) * 100);
          return (
            <div key={l.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-primary">{l.label}</span>
                <span className="font-mono text-xs text-secondary">
                  {l.cur}
                  {l.used.toLocaleString()} / {l.cur}
                  {l.max.toLocaleString()}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Notifications() {
  return (
    <Card>
      <ToggleRow label="Payments" sub="Money in and out" defaultOn />
      <ToggleRow label="Security alerts" sub="Logins and changes" defaultOn />
      <ToggleRow label="Product updates" sub="New features" />
      <ToggleRow label="Promotions" sub="Offers and rewards" />
    </Card>
  );
}

function DefaultCurrency() {
  return (
    <RadioList
      initial="GBP"
      options={wallets.map((w) => ({
        value: w.currency,
        label: `${w.name} (${w.currency})`,
        hint: `${w.symbol} ${w.account}`,
      }))}
    />
  );
}

function Language() {
  return (
    <RadioList
      initial="en"
      options={[
        { value: "en", label: "English", hint: "United Kingdom" },
        { value: "fr", label: "Français", hint: "France" },
        { value: "de", label: "Deutsch", hint: "Deutschland" },
        { value: "es", label: "Español", hint: "España" },
      ]}
    />
  );
}

function ChangePin() {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const valid = pin.length === 4 && pin === confirm;

  if (done) {
    return (
      <div className="flex flex-col items-center pt-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
          <Check size={32} className="text-success" strokeWidth={3} />
        </span>
        <p className="mt-4 text-sm font-medium text-primary">PIN updated</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PinField label="New PIN" value={pin} onChange={setPin} />
      <PinField label="Confirm PIN" value={confirm} onChange={setConfirm} />
      <button
        disabled={!valid}
        onClick={() => setDone(true)}
        className="h-12 w-full rounded-xl bg-accent text-sm font-semibold text-[#0E1117] active:scale-[0.98] disabled:opacity-40"
      >
        Update PIN
      </button>
    </div>
  );
}

function PinField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-secondary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        inputMode="numeric"
        type="password"
        placeholder="••••"
        className="mt-2 h-14 w-full rounded-xl border border-border bg-surface px-4 text-center font-mono text-2xl tracking-[0.5em] text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

function Biometrics() {
  return (
    <Card>
      <ToggleRow label="Face ID" sub="Unlock with your face" defaultOn />
      <ToggleRow label="Fingerprint" sub="Unlock with your fingerprint" />
      <ToggleRow label="Confirm payments" sub="Require biometrics to pay" defaultOn />
    </Card>
  );
}

function Sessions() {
  const sessions = [
    { device: "iPhone 15 Pro", loc: "London, UK", current: true, icon: Smartphone },
    { device: "MacBook Air", loc: "London, UK", current: false, icon: Laptop },
    { device: "Chrome · Windows", loc: "Berlin, DE", current: false, icon: Laptop },
  ];
  return (
    <Card>
      {sessions.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.device}
            className="flex items-center gap-3 border-b border-border/50 px-4 py-3.5 last:border-b-0"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-elevated">
              <Icon size={18} className="text-secondary" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">{s.device}</p>
              <p className="text-xs text-secondary">{s.loc}</p>
            </div>
            {s.current ? (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                This device
              </span>
            ) : (
              <button className="text-xs font-medium text-danger active:scale-95">
                End
              </button>
            )}
          </div>
        );
      })}
    </Card>
  );
}

function HelpCentre() {
  const topics = [
    "Getting started with Stash",
    "Adding and exchanging currencies",
    "Sending and receiving money",
    "Card limits and security",
    "Verifying your identity",
    "Fees and exchange rates",
  ];
  return (
    <Card>
      {topics.map((t) => (
        <button
          key={t}
          className="flex w-full items-center justify-between border-b border-border/50 px-4 py-3.5 text-left last:border-b-0 active:bg-white/5"
        >
          <span className="text-sm font-medium text-primary">{t}</span>
          <ChevronRight size={18} className="text-tertiary" />
        </button>
      ))}
    </Card>
  );
}

function ReportProblem() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center pt-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
          <Check size={32} className="text-success" strokeWidth={3} />
        </span>
        <p className="mt-4 text-sm font-medium text-primary">Report sent</p>
        <p className="mt-1 text-xs text-secondary">
          Our team will get back to you by email.
        </p>
      </div>
    );
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Describe the problem you ran into…"
        className="w-full resize-none rounded-xl border border-border bg-surface p-4 text-sm text-primary placeholder:text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <button
        disabled={text.trim().length < 5}
        onClick={() => setSent(true)}
        className="mt-4 h-12 w-full rounded-xl bg-accent text-sm font-semibold text-[#0E1117] active:scale-[0.98] disabled:opacity-40"
      >
        Submit report
      </button>
    </div>
  );
}

function RateApp() {
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center pt-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft ring-1 ring-accent/20">
          <Star size={32} className="text-accent" fill="currentColor" />
        </span>
        <p className="mt-4 text-sm font-medium text-primary">
          Thanks for the {rating}-star rating!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-secondary">How would you rate Stash?</p>
      <div className="mt-5 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className="active:scale-90"
            aria-label={`${n} stars`}
          >
            <Star
              size={36}
              className={n <= rating ? "text-accent" : "text-tertiary"}
              fill={n <= rating ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
      <button
        disabled={rating === 0}
        onClick={() => setSent(true)}
        className="mt-8 h-12 w-full rounded-xl bg-accent text-sm font-semibold text-[#0E1117] active:scale-[0.98] disabled:opacity-40"
      >
        Submit rating
      </button>
    </div>
  );
}
