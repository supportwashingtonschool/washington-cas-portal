import Link from "next/link"
import { notFound, redirect } from "next/navigation"
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
  ArrowLeft,
  GraduationCap,
  LogOut,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  UserCheck,
  Mail,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import ReflectionForm from "./reflection-form"
import SupervisorLinkCopy from "./supervisor-link-copy"

interface PageProps {
  params: Promise<{ id: string }>
}

interface Experience {
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
}

interface Reflection {
  id: string
  experience_id: string
  content: string
  evidence_url: string | null
  created_at: string
}

function getStatusBadge(status: Experience["status"]) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Approved
        </span>
      )
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
          <Sparkles className="h-3.5 w-3.5" />
          Completed
        </span>
      )
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <XCircle className="h-3.5 w-3.5" />
          Needs Revision
        </span>
      )
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
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

export default async function ExperienceDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch current user's profile to check if coordinator
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const isCoordinator = profile?.role === "coordinator"

  // Fetch the specific experience
  const { data: rawExp, error: expError } = await supabase
    .from("cas_experiences")
    .select("*")
    .eq("id", id)
    .single()

  if (expError || !rawExp) {
    notFound()
  }

  const experience = rawExp as Experience

  // Verify access authorization
  if (experience.student_id !== user.id && !isCoordinator) {
    redirect("/dashboard")
  }

  // Fetch reflections ordered by created_at descending
  const { data: rawReflections } = await supabase
    .from("reflections")
    .select("*")
    .eq("experience_id", id)
    .order("created_at", { ascending: false })

  const reflections = (rawReflections as Reflection[] | null) || []

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Top Navbar */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none sm:text-base">
                Washington School
              </h1>
              <p className="text-xs text-muted-foreground">IB CAS Portfolio Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs")}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
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

      {/* Main Content Area */}
      <main className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
            {experience.title}
          </span>
        </div>

        {/* Top Section: Experience Overview Card */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="space-y-4 pb-4 border-b">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1.5">
                <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {experience.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {experience.strands && experience.strands.length > 0 ? (
                    experience.strands.map((strand) => getStrandBadge(strand))
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      No strands specified
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">{getStatusBadge(experience.status)}</div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description &amp; Objectives
              </h3>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* Supervisor & Metadata Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Adult Supervisor
                </p>
                <p className="text-foreground font-medium">
                  {experience.supervisor_name || "None designated"}
                </p>
                {experience.supervisor_email && (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {experience.supervisor_email}
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1.5">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  Activity Timeline
                </p>
                <p className="text-muted-foreground">
                  Proposed on:{" "}
                  <strong className="text-foreground">
                    {new Date(experience.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </p>
                <p className="text-muted-foreground">
                  Reflections: <strong className="text-foreground">{reflections.length} logged</strong>
                </p>
              </div>
            </div>

            {/* Magic Link Copy Component for Supervisor */}
            <div className="pt-2">
              <SupervisorLinkCopy token={experience.supervisor_token} />
            </div>
          </CardContent>
        </Card>

        {/* Middle Section: Add Reflection Form */}
        <section className="space-y-3">
          <ReflectionForm
            experienceId={experience.id}
            experienceStatus={experience.status}
          />
        </section>

        {/* Bottom Section: Reflection Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">
                Reflection Journal ({reflections.length})
              </h2>
            </div>
          </div>

          {reflections.length === 0 ? (
            <Card className="border-dashed border-2 p-10 text-center bg-card/40">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold">No reflections recorded yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Use the form above to record your thoughts, achievements, and insights gained during this CAS activity.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reflections.map((refl, idx) => (
                <Card
                  key={refl.id}
                  className="shadow-sm border-border bg-card transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-2.5 border-b bg-muted/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                          #{reflections.length - idx}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          Journal Entry
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {new Date(refl.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {refl.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}