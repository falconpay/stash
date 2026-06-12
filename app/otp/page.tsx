"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { OtpInput } from "@/components/OtpInput";
import { PageTransition } from "@/components/PageTransition";
import { user, maskEmail } from "@/lib/data";

export default function OtpPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(42);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    const stored = sessionStorage.getItem("stash_email");
    if (stored) setEmail(stored);
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const handleComplete = () => {
    setTimeout(() => router.push("/dashboard"), 350);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col px-5 pb-8 pt-6 sm:min-h-[860px]">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface active:scale-95"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>

        <div className="mt-8">
          <h1 className="text-2xl font-bold tracking-tightest text-primary">
            Enter the code
          </h1>
          <p className="mt-2 text-sm text-secondary">
            We sent a 6-digit code to {maskEmail(email)}
          </p>
        </div>

        <div className="mt-10">
          <OtpInput onComplete={handleComplete} />
        </div>

        <div className="mt-6 text-center text-sm">
          {seconds > 0 ? (
            <span className="text-tertiary">
              Resend in{" "}
              <span className="font-mono text-secondary">
                {mm}:{ss}
              </span>
            </span>
          ) : (
            <button
              onClick={() => setSeconds(42)}
              className="font-medium text-accent active:scale-95"
            >
              Resend code
            </button>
          )}
        </div>

        <p className="mt-auto text-center text-xs text-tertiary">
          Didn’t get it? Check your messages app.
        </p>
      </div>
    </PageTransition>
  );
}
