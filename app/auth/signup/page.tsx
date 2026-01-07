import { SignupForm } from "@/components/signup/signupForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account | Simplified Trello Kongden-app",
  description: "Join kongden-app and start managing your life today",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-card/80 backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700">
        {/* Visual Content Section */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
              Start building your future with us.
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-md text-pretty">
              Join thousands of developers and creators building the next generation of web applications.
            </p>

            {/* Mock Dashboard Element for Immersive Look */}
            <div className="bg-background/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded w-3/4" />
                <div className="h-4 bg-white/20 rounded w-1/2" />
                <div className="h-20 bg-white/10 rounded-lg flex items-end p-2 gap-1">
                  {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        </div>

        {/* Signup Form Section */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight mb-2">Create an account</h2>
              <p className="text-muted-foreground">Enter your details below to get started</p>
            </div>

            <SignupForm />
          </div>
        </div>
      </div>
    </main>
  )
}
