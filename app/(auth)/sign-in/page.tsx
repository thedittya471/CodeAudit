import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign in · CodeAudit",
  description: "Sign in to CodeAudit to review and manage your pull requests.",
};

type SignInPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="border border-white/10 bg-[#0a0a0c]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#75757e]">
        <span className="flex items-center gap-2 text-[#9a9aa3]">
          <span className="size-1.5 rounded-full bg-[#ff4d00]" />
          Access
        </span>
        <span>SIGN IN</span>
      </div>
      <div className="px-6 py-8 sm:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-[#9a9aa3]">
          Sign in to continue reviewing your code.
        </p>
        <div className="mt-7">
          <AuthForm mode="sign-in" callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
