"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LogIn, Send, Upload, X, FileText, CheckCircle } from "lucide-react"
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
  title: string
  organization: string
  requestType: string
  message: string
  file: File | null
}

const initialState: FormState = {
  title: "",
  organization: "",
  requestType: "",
  message: "",
  file: null,
}

export function ContributeRequestForm() {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [userData, setUserData] = useState<{ name?: string; email?: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = window.localStorage.getItem("authToken")
      const storedUser = window.localStorage.getItem("userData")
      
      if (storedToken) setToken(storedToken)
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser))
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }
    }
  }, [])

  const canSubmit = useMemo(() => Boolean(token), [token])

  const handleChange = (field: keyof Omit<FormState, 'file'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    
    if (file) {
      // Validate file size (10MB to match Laravel validation)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setError("File size must be less than 10MB")
        event.target.value = "" // Reset input
        return
      }
      
      // Validate file type (match Laravel validation: xlsx, xls, csv)
      const allowedTypes = [
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv', // .csv
      ]
      
      const allowedExtensions = ['xls', 'xlsx', 'csv']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
        setError("Invalid file type. Only Excel (.xlsx, .xls) and CSV (.csv) files are allowed.")
        event.target.value = "" // Reset input
        return
      }
      
      setError(null)
    }
    
    setForm((prev) => ({ ...prev, file }))
  }

  const removeFile = () => {
    setForm((prev) => ({ ...prev, file: null }))
    // Reset file input
    const fileInput = document.getElementById('file') as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return

    const { title, organization, requestType, message, file } = form
    
    // Validate required fields
    if (!title.trim()) {
      setError("Title is required.")
      return
    }
    if (!organization.trim()) {
      setError("Organization is required.")
      return
    }
    if (!requestType.trim()) {
      setError("Request type is required.")
      return
    }
    if (!message.trim()) {
      setError("Message is required.")
      return
    }

    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('organization', organization.trim())
      formData.append('request_type', requestType.trim())
      formData.append('message', message.trim())
      
      // Add file if provided
      if (file) {
        formData.append('file', file)
      }

      await submitContribution(formData, token || undefined)
      
      setSuccess("Contribution submitted successfully! Your submission is pending admin review.")
      setForm(initialState)
      
      // Reset file input
      const fileInput = document.getElementById('file') as HTMLInputElement
      if (fileInput) fileInput.value = ""
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 5000)
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Submission failed. Please try again."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Show logged in user info */}
      {userData && canSubmit && (
        <div className="rounded-lg border border-green-300 bg-green-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-green-900">
            <CheckCircle className="h-4 w-4" />
            <span>
              Signed in as <strong>{userData.name || userData.email}</strong>
            </span>
          </div>
        </div>
      )}
      
      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Dataset/Request Title *</Label>
          <Input 
            id="title" 
            placeholder="e.g., Monthly Tourism Statistics 2024" 
            value={form.title} 
            onChange={handleChange("title")}
            disabled={!canSubmit}
            required
          />
          <p className="text-xs text-muted-foreground">
            Provide a clear, descriptive title for your submission
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="organization">Organization/Agency *</Label>
          <Input 
            id="organization" 
            placeholder="e.g., Provincial Tourism Office" 
            value={form.organization} 
            onChange={handleChange("organization")}
            disabled={!canSubmit}
            required
          />
        </div>
      </div>

      {/* Two Column Layout - Request Type and File Upload */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Request Type *</Label>
          <select
            id="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={form.requestType}
            onChange={handleChange("requestType")}
            disabled={!canSubmit}
            required
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
          <Label htmlFor="file">
            Upload File (Optional)
            <span className="ml-2 text-xs text-muted-foreground">(Max 10MB)</span>
          </Label>
          
          {!form.file ? (
            <div className="relative">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={!canSubmit}
                className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                accept=".xlsx,.xls,.csv"
              />
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Upload className="h-4 w-4" />
                <span>Excel (.xlsx, .xls) and CSV (.csv)</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-md border border-input bg-background p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{form.file.name}</span>
                  <span className="text-xs text-muted-foreground">{formatFileSize(form.file.size)}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={!canSubmit}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Message at the bottom - Full Width */}
      <div className="space-y-2">
        <Label htmlFor="message">Message/Description *</Label>
        <Textarea
          id="message"
          placeholder="Describe your request or submission in detail..."
          rows={5}
          value={form.message}
          onChange={handleChange("message")}
          disabled={!canSubmit}
          required
        />
        <p className="text-xs text-muted-foreground">
          Include any relevant details, time periods, or special requirements
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {success}
        </div>
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
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-amber-900">Authentication Required</span>
            <span className="text-amber-800">
              You must be signed in to submit a contribution request.
            </span>
            <Link href="/login" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <LogIn className="h-4 w-4" />
              Go to login page
            </Link>
          </div>
        </div>
      ) : null}
    </form>
  )
}