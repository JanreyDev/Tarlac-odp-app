"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LogIn, Send, Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react"
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

type FileWithId = {
  id: string
  file: File
}

type FormState = {
  title: string
  organization: string
  requestType: string
  message: string
  files: FileWithId[]
}

const initialState: FormState = {
  title: "",
  organization: "",
  requestType: "",
  message: "",
  files: [],
}

const MAX_FILES = 5
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

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
      
      console.log("Token check:", storedToken ? "Token found" : "No token")
      
      if (storedToken) setToken(storedToken)
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          console.log("User data:", parsed)
          setUserData(parsed)
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }
    }
  }, [])

  const canSubmit = useMemo(() => Boolean(token), [token])

  const handleChange = (field: keyof Omit<FormState, 'files'>) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const validateFile = (file: File): string | null => {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size must be less than 10MB`
    }
    
    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv', // .csv
    ]
    
    const allowedExtensions = ['xls', 'xlsx', 'csv']
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return `${file.name}: Invalid file type. Only Excel (.xlsx, .xls) and CSV files are allowed`
    }
    
    return null
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) return

    const currentFilesCount = form.files.length
    const newFilesCount = selectedFiles.length
    
    // Check if adding these files would exceed the limit
    if (currentFilesCount + newFilesCount > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} files. Currently you have ${currentFilesCount} file(s).`)
      event.target.value = ""
      return
    }

    // Validate each file
    const newFiles: FileWithId[] = []
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      const validationError = validateFile(file)
      
      if (validationError) {
        setError(validationError)
        event.target.value = ""
        return
      }
      
      // Check for duplicate filenames
      const isDuplicate = form.files.some(f => f.file.name === file.name)
      if (isDuplicate) {
        setError(`File "${file.name}" is already added`)
        event.target.value = ""
        return
      }
      
      newFiles.push({
        id: `${Date.now()}-${i}`,
        file: file
      })
    }
    
    setError(null)
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }))
    
    // Reset file input
    event.target.value = ""
  }

  const removeFile = (fileId: string) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId)
    }))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getTotalSize = (): string => {
    const total = form.files.reduce((sum, f) => sum + f.file.size, 0)
    return formatFileSize(total)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) {
      setError("You must be logged in to submit a contribution.")
      return
    }

    const { title, organization, requestType, message, files } = form
    
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
      console.log("Submitting with token:", token ? "Present" : "Missing")
      console.log("Files count:", files.length)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('title', title.trim())
      formData.append('organization', organization.trim())
      formData.append('request_type', requestType.trim())
      formData.append('message', message.trim())
      
      // Add all files with the key 'files[]'
      files.forEach((fileWithId, index) => {
        console.log(`Adding file ${index + 1}:`, fileWithId.file.name)
        formData.append('files[]', fileWithId.file)
      })

      // Debug: Log FormData contents
      console.log("FormData contents:")
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1] === 'object' ? '(File)' : pair[1])
      }

      const result = await submitContribution(formData, token || undefined)
      
      console.log("Submit success:", result)
      
      setSuccess(`Contribution submitted successfully with ${files.length} file(s)! Your submission is pending admin review.`)
      setForm(initialState)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 5000)
      
    } catch (err) {
      console.error("Submit error:", err)
      
      let message = "Submission failed. Please try again."
      
      if (err instanceof Error) {
        message = err.message
        
        // Check for specific authentication errors
        if (message.toLowerCase().includes("unauthenticated") || 
            message.toLowerCase().includes("unauthorized")) {
          message = "Session expired. Please log in again."
          // Clear token
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("authToken")
            window.localStorage.removeItem("userData")
          }
          setToken(null)
          setUserData(null)
        }
      }
      
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

      {/* Request Type */}
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

      {/* Multiple File Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="files">
            Upload Files (Optional)
            <span className="ml-2 text-xs text-muted-foreground">
              (Max {MAX_FILES} files, 10MB each)
            </span>
          </Label>
          {form.files.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {form.files.length} of {MAX_FILES} files • Total: {getTotalSize()}
            </span>
          )}
        </div>

        {/* File Input - Only show if under limit */}
        {form.files.length < MAX_FILES && (
          <div className="relative">
            <Input
              id="files"
              type="file"
              onChange={handleFileChange}
              disabled={!canSubmit}
              multiple
              className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
              accept=".xlsx,.xls,.csv"
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Upload className="h-4 w-4" />
              <span>Excel (.xlsx, .xls) and CSV (.csv) files only</span>
            </div>
          </div>
        )}

        {/* File limit warning */}
        {form.files.length >= MAX_FILES && (
          <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <AlertCircle className="h-4 w-4" />
            <span>Maximum file limit reached ({MAX_FILES} files)</span>
          </div>
        )}

        {/* Files List */}
        {form.files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Selected Files:</p>
            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
              {form.files.map((fileWithId) => (
                <div
                  key={fileWithId.id}
                  className="flex items-center justify-between rounded-md border border-input bg-background p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {fileWithId.file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(fileWithId.file.size)} • {fileWithId.file.type.split('/').pop()?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileWithId.id)}
                    disabled={!canSubmit || isSubmitting}
                    className="h-8 w-8 p-0 flex-shrink-0 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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
              Submit Request {form.files.length > 0 && `(${form.files.length} file${form.files.length > 1 ? 's' : ''})`}
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