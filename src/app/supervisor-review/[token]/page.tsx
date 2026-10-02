import { createClient } from "@/utils/supabase/server"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
  ShieldCheck,
} from "lucide-react"
import VerifyButton from "./verify-button"

interface PageProps {
  params: Promise<{ token: string }>
}

interface ExperienceWithProfile {
  id: string
  title: string
  description: string
  strands: string[]
  status: "pending" | "approved" | "completed" | "rejected"
  supervisor_name: string | null
  supervisor_email: string | null
  created_at: string
  profiles: { full_name: string } | { full_name: string }[] | null
}

function getStrandBadge(strand: string) {
  switch (strand.toLowerCase()) {
    case "creativity":
      return (
        <span
          key={strand}
          className="rounded-md border border-amber-500/30 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
        >
          Creativity
        </span>
      )
    case "activity":
      return (
        <span
          key={strand}
          className="rounded-md border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          Activity
        </span>
      )
    case "service":
      return (
        <span
          key={strand}
          className="rounded-md border border-blue-500/30 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Service
        </span>
      )
    default:
      return (
        <Badge key={strand} variant="outline">
          {strand}
        </Badge>
      )
  }
}

export const metadata = {
  title: "Supervisor Verification | Washington School CAS",
  description: "Verify and sign off on a student IB CAS experience",
}

export default async function SupervisorReviewPage({ params }: PageProps) {
  const { token } = await params
  const supabase = await createClient()

  // Fetch experience matching token with student full_name
  const { data: rawExperience, error } = await supabase
    .from("cas_experiences")
    .select("*, profiles(full_name)")
    .eq("supervisor_token", token)
    .maybeSingle()

  const experience = rawExperience as unknown as ExperienceWithProfile | null

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Top Header */}
      <header className="max-w-2xl mx-auto mb-8 text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md mb-2">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Washington School
        </h1>
        <p className="text-sm text-muted-foreground">
          IB Diploma Programme — CAS Supervisor Verification
        </p>
      </header>

      <main className="max-w-2xl mx-auto">
        {!experience || error ? (
          /* Error / Invalid Link Card */
          <Card className="border-destructive/30 shadow-lg text-center p-8 bg-card/80 backdrop-blur-md dark:bg-card/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-destructive">
              Invalid or Expired Link
            </CardTitle>
            <CardDescription className="text-sm max-w-md mx-auto mt-2 leading-relaxed">
              We could not find an active CAS experience matching this verification link. The activity may have been updated or removed. Please contact the student or the Washington School CAS coordinator.
            </CardDescription>
          </Card>
        ) : (
          /* Valid Experience Verification Card */
          <Card className="shadow-2xl border-border/70 bg-card/80 backdrop-blur-xl dark:bg-card/60 dark:border-white/10 overflow-hidden">
            {/* Header Banner */}
            <CardHeader className="bg-primary/5 border-b border-border/40 pb-5">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  Supervisor Sign-Off
                </span>
                {experience.status === "completed" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
                    <Sparkles className="h-3 w-3" />
                    Completed &amp; Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Pending Verification
                  </span>
                )}
              </div>

              <CardTitle className="text-2xl font-bold pt-2">
                Welcome, {experience.supervisor_name || "Supervisor"}!
              </CardTitle>
              <CardDescription className="text-sm">
                You have been requested to verify the student activity below for the Washington School IB CAS Digital Portfolio.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Student and Activity Information */}
              <div className="rounded-xl border border-border/50 bg-muted/30 backdrop-blur-xs p-4 space-y-3 dark:border-white/10 dark:bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Student Candidate</p>
                    <p className="text-sm font-semibold text-foreground">
                      {Array.isArray(experience.profiles)
                        ? experience.profiles[0]?.full_name
                        : experience.profiles?.full_name || "IB Student"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1">
                  <p className="text-xs text-muted-foreground">Experience Title</p>
                  <p className="text-base font-bold text-foreground">
                    {experience.title}
                  </p>
                </div>

                {/* Strands */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {experience.strands && experience.strands.length > 0 ? (
                    experience.strands.map((strand) => getStrandBadge(strand))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">No strands</span>
                  )}
                </div>
              </div>

              {/* Summary / Description */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity Summary &amp; Goals
                </h3>
                <div className="rounded-lg border border-border/50 bg-background/50 backdrop-blur-xs p-4 text-sm text-foreground/90 whitespace-pre-line leading-relaxed dark:border-white/10 dark:bg-background/40">
                  {experience.description}
                </div>
              </div>

              {/* Verification Section */}
              {experience.status === "completed" ? (
                /* Already Verified Banner */
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 backdrop-blur-xs p-6 text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 mb-2">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Activity Verified &amp; Completed
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-md mx-auto">
                    This activity has already been verified. Thank you for supporting our student&apos;s CAS journey!
                  </p>
                </div>
              ) : (
                /* Pending Sign-Off Action */
                <div className="space-y-4 pt-2">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 backdrop-blur-xs p-4 text-xs text-muted-foreground space-y-1">
                    <p className="font-semibold text-foreground">
                      Supervisor Declaration
                    </p>
                    <p>
                      By clicking below, you confirm that the student has engaged in the activity described above under your supervision and demonstrated commitment to the experience.
                    </p>
                  </div>

                  <div className="flex justify-center pt-2">
                    <VerifyButton token={token} />
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-border/40 bg-muted/20 backdrop-blur-xs py-3 px-6 text-center justify-center text-xs text-muted-foreground">
              Washington School CAS Portal &bull; Candidate School in the Philippines
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  )
}