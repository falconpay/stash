"use client";

import type { CurrencyCode } from "@/lib/data";

export function CurrencyTab({
  options,
  active,
  onChange,
}: {
  options: CurrencyCode[];
  active: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-surface p-1">
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors active:scale-[0.98]"
          >
            <span
              className={isActive ? "text-primary" : "text-secondary"}
            >
              {opt}
            </span>
            {isActive && (
              <span className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </div>
  );
}
