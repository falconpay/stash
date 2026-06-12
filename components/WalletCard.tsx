import { Eye, EyeOff } from "lucide-react";
import type { CurrencyCode, Wallet } from "@/lib/data";

const cardStyles: Record<
  CurrencyCode,
  { gradient: string; frost: string; badge: string }
> = {
  EUR: {
    gradient: "from-[#161B27] to-[#1a2040]",
    frost: "frost-border-blue",
    badge: "bg-[#1d2645] text-[#8fb0ff]",
  },
  GBP: {
    gradient: "from-[#161B27] to-[#1d1f2e]",
    frost: "frost-border-purple",
    badge: "bg-[#272140] text-[#bd9bff]",
  },
  USD: {
    gradient: "from-[#161B27] to-[#1e2318]",
    frost: "frost-border-green",
    badge: "bg-[#1c2c1d] text-[#7ee0a0]",
  },
};

export function WalletCard({
  wallet,
  hidden = false,
  onToggleHidden,
}: {
  wallet: Wallet;
  hidden?: boolean;
  onToggleHidden?: () => void;
}) {
  const style = cardStyles[wallet.currency];
  const formatted = wallet.balance.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={`frost-border ${style.frost} relative h-48 w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} p-5`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span
            className={`inline-block rounded-md px-2 py-0.5 font-mono text-xs font-medium ${style.badge}`}
          >
            {wallet.currency}
          </span>
          <p className="mt-3 text-xs text-secondary">Available balance</p>
        </div>
        <div className="flex items-center gap-2">
          {onToggleHidden && (
            <button
              onClick={onToggleHidden}
              aria-label={hidden ? "Show balance" : "Hide balance"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-secondary active:scale-90"
            >
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          <span className="font-mono text-sm text-tertiary">
            {wallet.account}
          </span>
        </div>
      </div>

      <div className="mt-2">
        <p className="font-mono text-[2rem] font-medium leading-none tracking-tight text-primary">
          {hidden ? (
            <span className="tracking-widest">••••••</span>
          ) : (
            <>
              {wallet.symbol}
              {formatted}
            </>
          )}
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-5">
        <p className="text-sm font-medium text-primary">{wallet.name}</p>
        <p className="text-xs text-secondary">{wallet.bank}</p>
      </div>
    </div>
  );
}
