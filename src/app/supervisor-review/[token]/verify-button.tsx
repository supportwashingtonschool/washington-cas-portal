"use client"

import { useTransition, useState } from "react"
import { verifyExperience } from "./actions"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

interface VerifyButtonProps {
  token: string
}

export default function VerifyButton({ token }: VerifyButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleVerify = () => {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await verifyExperience(token)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage("Failed to verify activity.")
        }
      }
    })
  }

  return (
    <div className="space-y-3 w-full sm:w-auto">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <Button
        type="button"
        size="lg"
        disabled={isPending}
        onClick={handleVerify}
        className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md text-sm px-6 py-2.5"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Confirming Verification...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>Verify &amp; Complete Activity</span>
          </>
        )}
      </Button>
    </div>
  )
}