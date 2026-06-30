"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  mode: AuthMode;
  callbackUrl?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1A6.2 6.2 0 0 1 5.8 12 6.2 6.2 0 0 1 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.1 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4 9.6-9.7 0-.65-.07-1.15-.16-1.65H12z"
      />
    </svg>
  );
}

const inputClass =
  "w-full border border-white/12 bg-white/[0.02] px-3.5 py-2.5 text-sm text-white placeholder:text-[#75757e] transition-colors focus:border-[#ff4d00]/60 focus:bg-white/[0.04] focus:outline-none";

export function AuthForm({ mode, callbackUrl = "/dashboard" }: AuthFormProps) {
  const router = useRouter();
  const isSignUp = mode === "sign-up";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [social, setSocial] = useState<"github" | "google" | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const onError = (ctx: { error: { message?: string } }) => {
      setError(ctx.error.message ?? "Something went wrong. Please try again.");
      setPending(false);
    };
    const onSuccess = () => {
      router.push(callbackUrl);
      router.refresh();
    };

    if (isSignUp) {
      await authClient.signUp.email(
        { name: name.trim() || email.split("@")[0], email, password },
        { onRequest: () => setPending(true), onSuccess, onError }
      );
    } else {
      await authClient.signIn.email(
        { email, password },
        { onRequest: () => setPending(true), onSuccess, onError }
      );
    }
  }

  async function handleSocial(provider: "github" | "google") {
    setError(null);
    setSocial(provider);
    try {
      await authClient.signIn.social({ provider, callbackURL: callbackUrl });
    } catch {
      setError("Could not start sign-in. Please try again.");
      setSocial(null);
    }
  }

  const busy = pending || social !== null;

  return (
    <div className="w-full">
      {/* social */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => handleSocial("github")}
          className="flex items-center justify-center gap-2 border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06] disabled:opacity-60"
        >
          {social === "github" ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <HugeiconsIcon icon={GithubIcon} className="size-4" />
          )}
          GitHub
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => handleSocial("google")}
          className="flex items-center justify-center gap-2 border border-white/15 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.06] disabled:opacity-60"
        >
          {social === "google" ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Google
        </button>
      </div>

      {/* divider */}
      <div className="my-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#75757e]">
        <span className="h-px flex-1 bg-white/10" />
        or with email
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {/* email / password */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignUp ? (
          <div className="space-y-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9a9aa3]">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9a9aa3]">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9a9aa3]">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder={isSignUp ? "At least 8 characters" : "••••••••"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error ? (
          <p className="border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 bg-[#ff4d00] px-4 py-3 text-sm font-semibold text-[#1a0a00] transition-colors hover:bg-[#ff6a2b] disabled:opacity-70"
        >
          {pending ? <Loader2Icon className="size-4 animate-spin" /> : null}
          {isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      {/* switch */}
      <p className="mt-6 text-center text-sm text-[#9a9aa3]">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="font-medium text-[#ff7a3d] transition-colors hover:text-[#ff4d00]"
        >
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
