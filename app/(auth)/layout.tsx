import Link from "next/link";
import Image from "next/image";
import { requireUnAuth } from "@/features/auth/actions";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();

  return (
    <div className="landing-root relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden bg-[#0a0a0c] px-4 py-12 text-[#e9e9ec]">
      {/* ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-144 w-144 -translate-x-1/2 rounded-full bg-[#ff4d00]/12 blur-[160px]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.4]">
          <defs>
            <pattern id="auth-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M72 0H0V72" fill="none" stroke="rgb(255 255 255 / 0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center bg-[#ff4d00]/12 ring-1 ring-[#ff4d00]/25">
          <Image src="/logo.svg" alt="" width={17} height={17} />
        </span>
        <span className="text-sm font-semibold tracking-tight text-white">CodeAudit</span>
      </Link>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
