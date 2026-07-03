"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valid = validEmail && password.length >= 6;

  return (
    <PageTransition>
      <div className="flex min-h-[100dvh] flex-col px-5 pb-8 pt-16 sm:min-h-[860px]">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft ring-1 ring-accent/20">
            <Wallet size={30} className="text-accent" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tightest text-primary">
            Trip
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Your money, every currency.
          </p>
        </div>

        {/* Form */}
        <div className="mt-14 flex-1 space-y-4">
          <div>
            <label className="text-sm font-medium text-secondary">Email</label>
            <div className="relative mt-2">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="h-14 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-base text-primary placeholder:text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-secondary">
              Password
            </label>
            <div className="relative mt-2">
              <Lock
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-14 w-full rounded-xl border border-border bg-surface pl-11 pr-12 text-base text-primary placeholder:text-tertiary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-secondary active:scale-95"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button className="mt-2 text-xs font-medium text-accent">
              Forgot password?
            </button>
          </div>
        </div>

        {/* CTA */}
        <div>
          <button
            disabled={!valid}
            onClick={() => {
              sessionStorage.setItem("trip_email", email);
              router.push("/otp");
            }}
            className="h-14 w-full rounded-xl bg-accent text-base font-semibold text-[#0E1117] transition-all active:scale-[0.98] disabled:opacity-40"
          >
            Log in
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-tertiary">
            By continuing, you agree to our{" "}
            <span className="text-secondary underline">Terms</span> &{" "}
            <span className="text-secondary underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
