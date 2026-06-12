"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

export function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete?: (code: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [pulse, setPulse] = useState<number | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string[]) => {
    setValues(next);
    if (next.every((d) => d !== "")) {
      onComplete?.(next.join(""));
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const next = [...values];
    next[index] = digit;
    commit(next);
    setPulse(index);
    setTimeout(() => setPulse(null), 180);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[index]) {
        next[index] = "";
        setValues(next);
      } else if (index > 0) {
        next[index - 1] = "";
        setValues(next);
        refs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      refs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    commit(next);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex justify-between gap-2">
      {values.map((value, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1}`}
          className={`h-14 w-12 rounded-xl border bg-surface text-center font-mono text-xl text-primary outline-none transition-all ${
            value ? "border-accent/60" : "border-border"
          } focus:border-accent focus:ring-2 focus:ring-accent/20 ${
            pulse === i ? "animate-pulse-scale" : ""
          }`}
        />
      ))}
    </div>
  );
}
