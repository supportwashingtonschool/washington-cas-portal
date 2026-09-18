"use client"

import { useState } from "react"
import Link from "next/link"
import { createExperience } from "@/app/dashboard/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Palette, Activity, HeartHandshake, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExperienceFormProps {
  error?: string
}

const STRAND_OPTIONS = [
  {
    id: "Creativity",
    label: "Creativity",
    description: "Arts, music, design, and creative thinking experiences.",
    icon: Palette,
    accentClass: "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200",
  },
  {
    id: "Activity",
    label: "Activity",
    description: "Physical exertion contributing to a healthy lifestyle.",
    icon: Activity,
    accentClass: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
  },
  {
    id: "Service",
    label: "Service",
    description: "Unpaid, voluntary community engagement and social impact.",
    icon: HeartHandshake,
    accentClass: "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200",
  },
]

export default function ExperienceForm({ error }: ExperienceFormProps) {
  const [selectedStrands, setSelectedStrands] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleStrand = (strandId: string) => {
    setSelectedStrands((prev) =>
      prev.includes(strandId)
        ? prev.filter((item) => item !== strandId)
        : [...prev, strandId]
    )
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 sm:px-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="shadow-lg border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Propose CAS Experience</CardTitle>
          <CardDescription>
            Submit your proposed activity for review by your CAS Coordinator. Once submitted, it will be marked as &quot;Pending&quot;.
          </CardDescription>
        </CardHeader>

        <form
          action={createExperience}
          onSubmit={() => setIsSubmitting(true)}
        >
          {/* Hidden inputs to guarantee form receives selected strands */}
          {selectedStrands.map((strand) => (
            <input key={strand} type="hidden" name="strands" value={strand} />
          ))}

          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Experience Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Experience Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Coastal Cleanup & Mangrove Planting in Batangas"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description &amp; Goals <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe what you will do, your personal aims, anticipated challenges, and learning targets..."
                required
              />
            </div>

            {/* Strands Selection */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold">
                  CAS Strands <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select at least one strand that applies to this experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STRAND_OPTIONS.map((strand) => {
                  const isChecked = selectedStrands.includes(strand.id)
                  const Icon = strand.icon
                  return (
                    <div
                      key={strand.id}
                      onClick={() => toggleStrand(strand.id)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all flex flex-col justify-between ${
                        isChecked
                          ? `${strand.accentClass} ring-2 ring-primary`
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="font-semibold text-sm">{strand.label}</span>
                        </div>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleStrand(strand.id)}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {strand.description}
                      </p>
                    </div>
                  )
                })}
              </div>

              {selectedStrands.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Please select at least one strand before submitting.
                </p>
              )}
            </div>

            {/* Supervisor Information */}
            <div className="space-y-3 pt-2 border-t">
              <div>
                <h3 className="text-sm font-semibold">Adult Supervisor Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  An adult supervisor (teacher, coach, or project leader) must verify this experience. Peers and family members cannot be supervisors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="supervisor_name">Supervisor Name</Label>
                  <Input
                    id="supervisor_name"
                    name="supervisor_name"
                    placeholder="e.g. Coach Roberto Gomez"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="supervisor_email">Supervisor Email</Label>
                  <Input
                    id="supervisor_email"
                    name="supervisor_email"
                    type="email"
                    placeholder="e.g. rgomez@washington.edu.ph"
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t pt-4">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || selectedStrands.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Propose Experience"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}