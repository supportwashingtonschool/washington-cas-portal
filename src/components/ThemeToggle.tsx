"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const emptySubscribe = () => () => {}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-9 w-9 p-0 rounded-lg border-border/60 bg-card/60 backdrop-blur-md opacity-60 pointer-events-none",
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "h-9 w-9 p-0 rounded-lg border-border/70 bg-card/65 backdrop-blur-md hover:bg-muted/80 hover:border-border text-foreground transition-all duration-200 shadow-xs dark:bg-card/45 dark:border-white/15 dark:hover:bg-muted/40",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45 motion-reduce:transition-none motion-reduce:transform-none" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transition-transform duration-300 hover:-rotate-12 motion-reduce:transition-none motion-reduce:transform-none" />
      )}
      <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
    </Button>
  )
}

export default ThemeToggle
