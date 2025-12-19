"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken")

    if (token) {
      try {
        await fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
      } catch {
        // ignore API errors
      }
    }

    localStorage.removeItem("authToken")
    setIsLoggedIn(false)
    router.push("/login")
  }

  if (!isLoggedIn) {
    return (
      <Link href="/login">
        <Button variant="default" className="text-sm">
          Login
        </Button>
      </Link>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="text-sm">
          Logout
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to access protected features.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>
            Yes, log me out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
