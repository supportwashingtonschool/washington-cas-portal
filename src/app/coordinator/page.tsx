import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/login/actions"
import { Button, buttonVariants } from "@/components/ui/button"
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
  LogOut,
  ShieldCheck,
  User,
  Clock,
  CheckCheck,
  ArrowLeft,
  Mail,
  UserCheck,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import StatusActionButtons from "./status-action-buttons"

interface ExperienceWithProfile {
  id: string
  student_id: string
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
  title: "Coordinator Approval Queue | Washington School CAS",
  description: "Review and approve pending IB CAS candidate proposals",
}

export default async function CoordinatorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch coordinator profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  // Guard: Coordinators only
  if (profile?.role !== "coordinator") {
    redirect("/dashboard")
  }

  // Relational query fetching all pending experiences and associated student's full_name
  const { data: rawExperiences, error } = await supabase
    .from("cas_experiences")
    .select("*, profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching coordinator experiences:", error)
  }

  const pendingList = (rawExperiences as unknown as ExperienceWithProfile[] | null) || []

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Top Navbar */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-600 text-white font-semibold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none sm:text-base">
                Washington School
              </h1>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                Coordinator Review Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Student View</span>
            </Link>

            <form action={logout}>
              <Button variant="outline" size="sm" type="submit" className="gap-1.5 text-xs">
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Review Queue */}
      <main className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">CAS Approval Queue</h2>
              <span className="rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs px-2.5 py-0.5 font-semibold">
                {pendingList.length} Pending
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Review candidate IB CAS proposals, evaluate strand coverage, and record approvals or revisions.
            </p>
          </div>
        </div>

        {/* Proposals List */}
        {pendingList.length === 0 ? (
          <Card className="border-dashed border-2 p-12 text-center bg-card/50">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-3">
              <CheckCheck className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold">All Caught Up!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-6">
              There are currently no candidate CAS experiences waiting in the approval queue.
            </p>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Student Dashboard
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingList.map((exp) => {
              // Extract student full_name safely
              const studentName = Array.isArray(exp.profiles)
                ? exp.profiles[0]?.full_name
                : exp.profiles?.full_name || "Student Candidate"

              return (
                <Card
                  key={exp.id}
                  className="shadow-sm border-border bg-card transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3 border-b bg-muted/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Proposed by</p>
                          <p className="text-sm font-semibold text-foreground leading-none">
                            {studentName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(exp.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                          <Clock className="h-3 w-3" />
                          Pending Review
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <CardTitle className="text-lg font-bold">{exp.title}</CardTitle>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {exp.strands && exp.strands.length > 0 ? (
                          exp.strands.map((strand) => getStrandBadge(strand))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            No strands selected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Description &amp; Goals
                      </p>
                      <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                        {exp.description}
                      </p>
                    </div>

                    {/* Supervisor details */}
                    {(exp.supervisor_name || exp.supervisor_email) && (
                      <div className="rounded-lg border bg-muted/30 p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            Supervisor:{" "}
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
                  </CardContent>

                  <CardFooter className="border-t bg-muted/10 py-3 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Action will immediately update the student&apos;s portfolio.
                    </p>
                    <StatusActionButtons
                      experienceId={exp.id}
                      studentName={studentName}
                    />
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}