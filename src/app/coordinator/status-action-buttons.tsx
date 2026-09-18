"use client"

import { useTransition, useState } from "react"
import { updateExperienceStatus } from "./actions"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"

interface StatusActionButtonsProps {
  experienceId: string
  studentName?: string
}

export default function StatusActionButtons({
  experienceId,
}: StatusActionButtonsProps) {
  const [isPending, startTransition] = useTransition()
  const [actionType, setActionType] = useState<"approved" | "rejected" | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleStatusChange = (status: "approved" | "rejected") => {
    setErrorMessage(null)
    setActionType(status)
    startTransition(async () => {
      try {
        await updateExperienceStatus(experienceId, status)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage("Failed to update status.")
        }
      } finally {
        setActionType(null)
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      {errorMessage && (
        <span className="text-xs text-destructive">{errorMessage}</span>
      )}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {/* Reject Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => handleStatusChange("rejected")}
          className="gap-1 text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/60"
        >
          {isPending && actionType === "rejected" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )}
          <span>Reject</span>
        </Button>

        {/* Approve Button */}
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => handleStatusChange("approved")}
          className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
        >
          {isPending && actionType === "approved" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          <span>Approve</span>
        </Button>
      </div>
    </div>
  )
}