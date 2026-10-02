"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Copy, Check, ExternalLink, Link as LinkIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SupervisorLinkCopyProps {
  token: string
}

export default function SupervisorLinkCopy({ token }: SupervisorLinkCopyProps) {
  const [copied, setCopied] = useState(false)

  // Use current origin if window available, fallback to localhost:3000
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  const magicLink = `${baseUrl}/supervisor-review/${token}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(magicLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5 backdrop-blur-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
          <LinkIcon className="h-3.5 w-3.5 text-primary" />
          <span>Supervisor Verification Magic Link</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          No login required for supervisor
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={magicLink}
          className="text-xs font-mono bg-background/60 backdrop-blur-xs select-all h-8 border-border/60"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCopy}
          className="shrink-0 h-8 gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </Button>

        <a
          href={magicLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Open verification link"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "shrink-0 h-8 px-2 text-xs"
          )}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Share this unique link with your supervisor so they can verify and endorse your completed CAS hours.
      </p>
    </div>
  )
}