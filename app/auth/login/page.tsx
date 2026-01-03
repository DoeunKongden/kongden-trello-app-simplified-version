"use client"

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function page() {

    const router = useRouter();
    const searchParams = useSearchParams();

    // State for handling user input & handling error
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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
        } else if (result?.ok) {
            const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
            router.push(callbackUrl);
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Simplified Trello</h1>
                    <p className="mt-2 text-lg text-gray-600">Sign in to manage your tasks</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {showResendLink && (
                            <div className="text-center">
                                <Link
                                    href="/auth/resend-verification"
                                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                    Resend verification email
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
