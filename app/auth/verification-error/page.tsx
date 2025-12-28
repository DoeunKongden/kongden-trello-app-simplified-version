import Link from "next/link";
import { Suspense } from "react";

function getErrorMessage(message: string | null) {
  switch (message) {
    case "missing-token":
      return {
        title: "Missing Verification Token",
        description: "The verification link is incomplete. Please check your email and try again.",
      };
    case "invalid-token":
      return {
        title: "Invalid Verification Token",
        description: "This verification link is not valid. It may have already been used or is incorrect.",
      };
    case "expired-token":
      return {
        title: "Verification Link Expired",
        description: "This verification link has expired. Please request a new verification email.",
      };
    case "user-not-found":
      return {
        title: "Account Not Found",
        description: "The account associated with this verification link no longer exists.",
      };
    case "server-error":
      return {
        title: "Verification Error",
        description: "An error occurred while verifying your email. Please try again later.",
      };
    default:
      return {
        title: "Verification Error",
        description: "Something went wrong with email verification. Please try again.",
      };
  }
}

export default function VerificationErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

async function VerificationErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const error = getErrorMessage(params.message || null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-32 px-8 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Error Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <svg
              className="h-10 w-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            {error.title}
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {error.description}
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/api/auth/signup"
              className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto"
            >
              Sign Up Again
            </Link>
            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

