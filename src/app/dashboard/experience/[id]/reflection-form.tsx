"use client"

import { useRef, useState } from "react"
import { addReflection } from "./actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PenLine, Send, Loader2, Sparkles } from "lucide-react"

interface ReflectionFormProps {
  experienceId: string
  experienceStatus: string
}

export default function ReflectionForm({
  experienceId,
}: ReflectionFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg(null)
    setIsSubmitting(true)
    try {
      await addReflection(formData)
      formRef.current?.reset()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Failed to submit reflection.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="shadow-xs border-border/60 bg-card/75 backdrop-blur-md dark:bg-card/55 dark:border-white/10">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PenLine className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Add CAS Reflection</CardTitle>
              <CardDescription className="text-xs">
                Reflect on your personal growth, challenges overcome, and IB learning outcomes.
              </CardDescription>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground font-medium">
            <Sparkles className="h-3 w-3 text-amber-500" />
            Digital Journal
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="experience_id" value={experienceId} />

          {errorMsg && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="reflection-content" className="text-xs font-semibold">
              Reflection Entry
            </Label>
            <Textarea
              id="reflection-content"
              name="content"
              rows={4}
              placeholder="What specifically did you accomplish during this session? What unexpected difficulties arose, and how did you resolve them? Which CAS learning outcomes did you demonstrate?"
              required
              className="resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-muted-foreground">
              Tip: Quality reflections connect directly to IB CAS learning outcomes.
            </p>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Post Reflection</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}