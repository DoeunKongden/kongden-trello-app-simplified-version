import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-32 px-8 sm:px-16">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Email Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              className="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            Check Your Email
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to verify your account.
          </p>
          <p className="max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            The verification link will expire in 24 hours.
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/auth/resend-verification"
              className="flex h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-auto"
            >
              Resend Verification Email
            </Link>
            <Link
              href="/auth/login"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-auto"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}