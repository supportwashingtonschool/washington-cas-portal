import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/login/actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowLeft,
  GraduationCap,
  LogOut,
  ShieldCheck,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserCheck,
  Mail,
  BookOpen,
  MessageSquare,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

interface Reflection {
  id: string
  experience_id: string
  content: string
  evidence_url: string | null
  created_at: string
}

interface ExperienceWithReflections {
  id: string
  student_id: string
  title: string
  description: string
  strands: string[]
  status: "pending" | "approved" | "completed" | "rejected"
  supervisor_name: string | null
  supervisor_email: string | null
  supervisor_token: string
  created_at: string
  reflections: Reflection[]
}

function getStatusBadge(status: ExperienceWithReflections["status"]) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      )
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
          <Sparkles className="h-3.5 w-3.5" />
          Completed
        </span>
      )
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <XCircle className="h-3.5 w-3.5" />
          Needs Revision
        </span>
      )
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <Clock className="h-3.5 w-3.5" />
          Pending Review
        </span>
      )
  }
}

function getStrandBadge(strand: string) {
  switch (strand.toLowerCase()) {
    case "creativity":
      return (
        <span
          key={strand}
          className="rounded-md border border-amber-500/30 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
        >
          Creativity
        </span>
      )
    case "activity":
      return (
        <span
          key={strand}
          className="rounded-md border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          Activity
        </span>
      )
    case "service":
      return (
        <span
          key={strand}
          className="rounded-md border border-blue-500/30 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Service
        </span>
      )
    default:
      return (
        <Badge key={strand} variant="outline" className="text-[11px]">
          {strand}
        </Badge>
      )
  }
}

export const metadata = {
  title: "Student Portfolio Audit | Washington School CAS",
  description: "Read-only coordinator review of candidate CAS portfolio",
}

export default async function StudentPortfolioAuditPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Security Gate: Verify current user is a coordinator
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  if (currentProfile?.role !== "coordinator") {
    redirect("/dashboard")
  }

  // Fetch target student profile
  const { data: student, error: studentError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (studentError || !student) {
    notFound()
  }

  // Relational fetch: All experiences with nested reflections
  const { data: rawExperiences } = await supabase
    .from("cas_experiences")
    .select("*, reflections(*)")
    .eq("student_id", id)
    .order("created_at", { ascending: false })

  const experiences = (rawExperiences as unknown as ExperienceWithReflections[]) || []

  // Calculate summary metrics
  const totalReflections = experiences.reduce(
    (acc, exp) => acc + (exp.reflections?.length || 0),
    0
  )
  const completedCount = experiences.filter(
    (exp) => exp.status === "completed"
  ).length
  const approvedCount = experiences.filter(
    (exp) => exp.status === "approved"
  ).length

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-background/75 backdrop-blur-md sticky top-0 z-30 shadow-xs dark:bg-background/65 dark:border-white/10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white font-semibold shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none sm:text-base">
                Washington School
              </h1>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Coordinator Audit View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 text-xs"
              )}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Coordinator Dashboard</span>
            </Link>

            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="gap-1.5 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Coordinator Dashboard
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
            {student.full_name}&apos;s Portfolio
          </span>
        </div>

        {/* Student Audit Header Card */}
        <Card className="border-purple-200/60 dark:border-purple-900/40 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent backdrop-blur-md shadow-xs">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {student.full_name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Candidate Student ID: <span className="font-mono">{student.id}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300/40 shadow-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  CAS Portfolio Audit View
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm p-3 shadow-2xs dark:border-white/10 dark:bg-background/40">
                <p className="text-xs text-muted-foreground">Total Experiences</p>
                <p className="text-xl font-bold mt-0.5 text-foreground">
                  {experiences.length}
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm p-3 shadow-2xs dark:border-white/10 dark:bg-background/40">
                <p className="text-xs text-muted-foreground">Approved</p>
                <p className="text-xl font-bold mt-0.5 text-emerald-600 dark:text-emerald-400">
                  {approvedCount}
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm p-3 shadow-2xs dark:border-white/10 dark:bg-background/40">
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-xl font-bold mt-0.5 text-purple-600 dark:text-purple-400">
                  {completedCount}
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm p-3 shadow-2xs dark:border-white/10 dark:bg-background/40">
                <p className="text-xs text-muted-foreground">Reflections Logged</p>
                <p className="text-xl font-bold mt-0.5 text-blue-600 dark:text-blue-400">
                  {totalReflections}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiences & Reflections Feed */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                CAS Experiences &amp; Reflection Log ({experiences.length})
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Read-Only Evaluation Mode
            </span>
          </div>

          {experiences.length === 0 ? (
            <Card className="border-dashed border-2 p-12 text-center bg-card/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold">
                No CAS experiences proposed yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                This student has not yet submitted any Creativity, Activity, or Service proposals.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {experiences.map((exp) => {
                // Sort reflections chronologically descending
                const sortedReflections = [...(exp.reflections || [])].sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )

                return (
                  <Card
                    key={exp.id}
                    className="shadow-sm border-border/60 bg-card/75 backdrop-blur-md overflow-hidden dark:bg-card/55 dark:border-white/10"
                  >
                    {/* Experience Header */}
                    <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 backdrop-blur-xs">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1.5">
                          <CardTitle className="text-xl font-bold leading-snug">
                            {exp.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {exp.strands && exp.strands.length > 0 ? (
                              exp.strands.map((strand) => getStrandBadge(strand))
                            ) : (
                              <span className="text-xs text-muted-foreground italic">
                                No strands specified
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">{getStatusBadge(exp.status)}</div>
                      </div>
                    </CardHeader>

                    {/* Experience Content */}
                    <CardContent className="pt-4 space-y-5">
                      {/* Description */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Description &amp; Goals
                        </h4>
                        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      {/* Supervisor and Activity Metadata */}
                      {(exp.supervisor_name || exp.supervisor_email) && (
                        <div className="rounded-lg border border-border/50 bg-muted/30 backdrop-blur-xs p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 dark:border-white/10 dark:bg-muted/20">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">
                              Adult Supervisor:{" "}
                              <strong className="text-foreground">
                                {exp.supervisor_name || "N/A"}
                              </strong>
                            </span>
                          </div>
                          {exp.supervisor_email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span>{exp.supervisor_email}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Nested Reflections Timeline */}
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Reflections Log ({sortedReflections.length})
                          </h4>
                        </div>

                        {sortedReflections.length === 0 ? (
                          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground bg-muted/20">
                            No reflection entries recorded for this experience yet.
                          </div>
                        ) : (
                          <div className="space-y-3 pl-2 sm:pl-3 border-l-2 border-primary/20">
                            {sortedReflections.map((refl, idx) => (
                              <div
                                key={refl.id}
                                className="rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm p-3.5 text-xs space-y-2 shadow-2xs dark:bg-background/40 dark:border-white/10"
                              >
                                <div className="flex items-center justify-between text-muted-foreground">
                                  <span className="font-semibold text-primary">
                                    Entry #{sortedReflections.length - idx}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(refl.created_at).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-foreground/90 whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                                  {refl.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="border-t border-border/40 bg-muted/20 backdrop-blur-xs py-2.5 px-6 text-xs text-muted-foreground flex items-center justify-between">
                      <span>
                        Proposed on:{" "}
                        {new Date(exp.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-mono text-[11px]">
                        ID: {exp.id.slice(0, 8)}...
                      </span>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}