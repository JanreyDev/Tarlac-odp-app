"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginRequest } from "@/lib/api"

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = (formData.get("email") as string | null)?.trim() ?? ""
    const password = (formData.get("password") as string | null)?.trim() ?? ""

    if (!email || !password) {
      setError("Enter both email and password to continue.")
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const response = await loginRequest({ email, password, remember: rememberMe })
      const token = response?.token || (response as { access_token?: string })?.access_token

      if (token && typeof window !== "undefined") {
        window.localStorage.setItem("authToken", token)
      }

      setSuccess(response?.message || "Login successful. Redirecting to contribute page...")
      window.setTimeout(() => {
        router.push("/contribute")
      }, 700)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed. Please try again."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-border/70 shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Lock className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-wide">Secure access</p>
        </div>
        <CardTitle className="text-2xl">Contributor sign-in</CardTitle>
        <CardDescription>Sign in to submit datasets, updates, or feedback for publishing.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.ph"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-muted-foreground">
              Use your government-issued email for faster verification.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-xs text-muted-foreground">Keep your credentials private</span>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground" htmlFor="remember">
              <Checkbox id="remember" name="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
              <span>Remember me</span>
            </label>
            <Button variant="link" size="sm" className="px-0 text-sm font-semibold" asChild>
              <Link href="/contribute">Contribution guidelines</Link>
            </Button>
          </div>

          {error ? (
            <div
              className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="status"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}

          {success ? (
            <div
              className="flex items-center gap-2 rounded-md border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{success}</span>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="flex w-full items-center gap-2 text-xs text-muted-foreground">
          <div className="h-px w-full bg-border" />
          <span>or</span>
          <div className="h-px w-full bg-border" />
        </div>
        <div className="flex w-full flex-col gap-2 text-sm text-muted-foreground">
          <span>Need access? Request an account from the data team.</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-primary/10 px-2 py-1 font-medium text-primary">Tip</span>
            <span>Use your government-issued email to speed up approval.</span>
          </div>
        </div>
        <Button variant="secondary" className="w-full" asChild>
          <Link href="/">Back to portal home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
