import { formatAmount, type Transaction } from "@/lib/data";
import { categoryMeta } from "./categoryIcon";

export function TransactionRow({ tx }: { tx: Transaction }) {
  const meta = categoryMeta[tx.category];
  const Icon = meta.icon;
  const isCredit = tx.type === "credit";

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${meta.tint}`}
      >
        <Icon size={20} className={meta.fg} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-primary">
          {tx.merchant}
        </p>
        <p className="text-xs text-secondary">{tx.date}</p>
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
        <p className="text-[10px] text-tertiary">{tx.currency}</p>
      </div>
    </div>
  );
}
