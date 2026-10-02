"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { login, signup } from "./actions"
import { GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react"

interface LoginFormProps {
  error?: string
  message?: string
}

export default function LoginForm({ error, message }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "signup">("login")

  return (
    <Card className="w-full max-w-md shadow-2xl border-border/70 bg-card/80 backdrop-blur-xl dark:bg-card/60 dark:border-white/10">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
          <GraduationCap className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Washington School
        </CardTitle>
        <CardDescription className="text-sm">
          {mode === "login"
            ? "Sign in to access your IB CAS Digital Portfolio"
            : "Create your student or coordinator portfolio account"}
        </CardDescription>

        <div className="flex rounded-lg bg-muted/70 backdrop-blur-xs p-1 mt-3 border border-border/40">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>
      </CardHeader>

      <form action={mode === "login" ? login : signup}>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="e.g. Maria Santos"
                required={mode === "signup"}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="student@washington.edu.ph"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign In to CAS" : "Create CAS Account"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}