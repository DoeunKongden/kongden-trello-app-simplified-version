"use client"

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, LogIn, Github, Chrome } from "lucide-react";


export default function page() {

    const router = useRouter();
    const searchParams = useSearchParams();

    // State for handling user input & handling error
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    //handling whether or not to send the verification link agian, in case of unverified user try to login
    const [showResendLink, setShowResendLink] = useState<boolean>(false);


    //handle error for protected route
    useEffect(() => {
        const urlError = searchParams.get('error');

        if (urlError === "SessionRequired") {
            setError("Please sign in to continue.");
        }

    }, [searchParams])


    // function for handling user submit request
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setShowResendLink(false);
        setLoading(true);

        const result = await signIn<'credentials'>("credentials", {
            email: email.trim().toLowerCase(),
            password,
            redirect: false,
        })


        console.log("Login with credential result", result)
        

        if (result?.error) {
            if (result?.error.toLowerCase().includes('verify your email')) {
                setError("Please verify your email address first. Check your inbox (and spam).");
                setShowResendLink(true);
            } else if (result.error.toLowerCase().includes("both email & password")) {
                setError("Please enter both email and password");
            } else {
                setError("Invalid email or password. Please try again.");
            }
            setLoading(false);
        } else if (result?.ok) {
            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
            router.push(callbackUrl);
            router.refresh();
        } else {
            setLoading(false);
        }
    }

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
                            Welcome back to your workspace.
                        </h1>
                        <p className="text-lg text-primary-foreground/80 mb-8 max-w-md text-pretty">
                            Sign in to continue managing your tasks and projects with ease.
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

                {/* Login Form Section */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold tracking-tight mb-2">Sign in to your account</h2>
                            <p className="text-muted-foreground">Enter your credentials to access your workspace</p>
                        </div>

                        <form className="grid gap-6" onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                        placeholder="name@example.com"
                                        className="h-11"
                            />
                        </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                id="password"
                                            type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                            className="h-11 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                        </div>

                        {error && (
                                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {showResendLink && (
                            <div className="text-center">
                                <Link
                                    href="/auth/resend-verification"
                                            className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 font-medium"
                                >
                                    Resend verification email
                                </Link>
                            </div>
                        )}

                                <Button disabled={loading} className="h-11 font-semibold cursor-pointer" type="submit">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="mr-2 h-4 w-4" />
                                            Sign in
                                        </>
                                    )}
                                </Button>
                            </div>
                    </form>

                        <div className="relative mt-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <Button 
                                variant="outline" 
                                disabled={loading} 
                                className="h-11 bg-transparent cursor-pointer"
                                onClick={() => signIn("github", { callbackUrl: searchParams.get("callbackUrl") || "/dashboard" })}
                            >
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button 
                                variant="outline" 
                                disabled={loading} 
                                className="h-11 bg-transparent cursor-pointer"
                                onClick={() => signIn("google", { callbackUrl: searchParams.get("callbackUrl") || "/dashboard" })}
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                        Don't have an account?{" "}
                            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary font-medium">
                            Sign up
                        </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
