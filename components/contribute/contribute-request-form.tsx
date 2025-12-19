"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LogIn, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContribution } from "@/lib/api"

const requestTypes = [
  { value: "submit_dataset", label: "Submit Dataset" },
  { value: "request_dataset", label: "Request Dataset" },
  { value: "report_issue", label: "Report Issue" },
  { value: "feedback", label: "General Feedback" },
]


type FormState = {
  name: string
  email: string
  organization: string
  requestType: string
  message: string
}

const initialState: FormState = {
  name: "",
  email: "",
  organization: "",
  requestType: "",
  message: "",
}

export function ContributeRequestForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : null
    if (stored) setToken(stored)
  }, [])

  const canSubmit = useMemo(() => Boolean(token), [token])

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const { organization, requestType, message } = form
    if (!organization.trim() || !requestType.trim() || !message.trim()) {
      setError("Organization, request type, and message are required.")
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      await submitContribution(
        {
          organization: organization.trim(),
          request_type: requestType.trim(),
          message: message.trim(),
          name: form.name.trim() || undefined,
          email: form.email.trim() || undefined,
        },
        token || undefined,
      )
      setSuccess("Contribution submitted successfully. Thank you!")
      setForm(initialState)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed. Please try again."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your full name" value={form.name} onChange={handleChange("name")}/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange("email")}/>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input id="organization" placeholder="Your organization or agency" value={form.organization} onChange={handleChange("organization")}/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Request Type</Label>
        <select
          id="type"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={form.requestType}
          onChange={handleChange("requestType")}
          disabled={!canSubmit}
        >
          <option value="">Select a type</option>
          {requestTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Describe your request or submission in detail..."
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          disabled={!canSubmit}
        />
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{success}</div>
      ) : null}

      <Button type="submit" className="w-full" disabled={!canSubmit || isSubmitting}>
        {canSubmit ? (
          isSubmitting ? (
            "Submitting..."
          ) : (
            <span className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Request
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign in to submit
          </span>
        )}
      </Button>

      {!canSubmit ? (
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="rounded-full bg-secondary/40 px-3 py-2 text-xs font-medium text-foreground">Not signed in</div>
          <Link href="/login" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <LogIn className="h-4 w-4" />
            Go to login
          </Link>
        </div>
      ) : null}
    </form>
  )
}
