"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Chrome, Loader2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    const newErrors: { [key: string]: string } = {}

    // Name validation
    if (!name || name.trim().length === 0) {
      newErrors.name = "Name is required."
    } else if (name.length > 100) {
      newErrors.name = "Name must be less than 100 characters."
    }

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    // Password complexity validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long."
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      newErrors.password = "Password must include uppercase, lowercase, and a number."
    }

    // Password match validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Make actual API call
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle API errors
        if (data.error) {
          if (typeof data.error === "string") {
            toast({
              title: "Signup failed",
              description: data.error,
              variant: "destructive",
            })
          } else if (Array.isArray(data.error)) {
            // Handle Zod validation errors
            const errorMessages = data.error.map((err: any) => err.message).join(", ")
            toast({
              title: "Validation failed",
              description: errorMessages,
              variant: "destructive",
            })
          } else if (data.details) {
            toast({
              title: "Validation failed",
              description: data.details,
              variant: "destructive",
            })
          }
        }
        setIsLoading(false)
        return
      }

      // Success
      toast({
        title: "Account created!",
        description: data.message || "Please check your email to verify your account.",
      })

      // Redirect to verification page or login
      setTimeout(() => {
        router.push("/auth/verified")
      }, 1500)
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              required
              className={`h-11 ${errors.name ? "border-destructive ring-destructive" : ""}`}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
              className={`h-11 ${errors.email ? "border-destructive ring-destructive" : ""}`}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                required
                className={`h-11 pr-10 ${errors.password ? "border-destructive ring-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              required
              className={`h-11 ${errors.confirmPassword ? "border-destructive ring-destructive" : ""}`}
            />
            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
          </div>
          <Button disabled={isLoading} className="h-11 font-semibold cursor-pointer">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up with Email
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" disabled={isLoading} className="h-11 bg-transparent cursor-pointer">
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button variant="outline" disabled={isLoading} className="h-11 bg-transparent cursor-pointer">
          <Chrome className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-2">
        Already have an account?{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}
