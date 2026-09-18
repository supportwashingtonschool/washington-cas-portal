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
  Sparkles,
  User,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Mail,
  UserCheck,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Experience {
  id: string
  student_id: string
  title: string
  description: string
  strands: string[]
  status: "pending" | "approved" | "completed" | "rejected"
  supervisor_name: string | null
  supervisor_email: string | null
  created_at: string
}

function getStatusBadge(status: Experience["status"]) {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </span>
      )
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-purple-300 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
          <Sparkles className="h-3 w-3" />
          Completed
        </span>
      )
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
          <XCircle className="h-3 w-3" />
          Needs Revision
        </span>
      )
    case "pending":
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
          <Clock className="h-3 w-3" />
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

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const role = profile?.role || "student"
  const fullName =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User"
  const isCoordinator = role === "coordinator"

  // Query experiences for the logged-in student
  const { data: rawExperiences } = await supabase
    .from("cas_experiences")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  const experiences = (rawExperiences as Experience[] | null) || []

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
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
            {/* Coordinator Direct Link */}
            {isCoordinator && (
              <Link
                href="/coordinator"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "hidden sm:inline-flex gap-1.5 text-xs bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Go to Coordinator Portal</span>
              </Link>
            )}

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-medium">{fullName}</span>
              <span className="text-xs text-muted-foreground capitalize">{role}</span>
            </div>

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
      <main className="container mx-auto max-w-5xl py-8 px-4 sm:px-6 space-y-8">
        {/* Welcome & Action Banner */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl font-bold">
                    Welcome back, {fullName}!
                  </CardTitle>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isCoordinator
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300/40"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300/40"
                    }`}
                  >
                    {isCoordinator ? (
                      <>
                        <ShieldCheck className="h-3 w-3" />
                        CAS Coordinator
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" />
                        IB Student
                      </>
                    )}
                  </span>
                </div>
                <CardDescription className="text-sm">
                  {isCoordinator
                    ? "Manage candidate student experiences, monitor strand coverage, and issue approvals."
                    : "Track your Creativity, Activity, and Service experiences and document your reflections."}
                </CardDescription>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isCoordinator && (
                  <Link
                    href="/coordinator"
                    className={cn(
                      buttonVariants(),
                      "gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-sm font-semibold"
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Go to Coordinator Portal
                  </Link>
                )}

                <Link
                  href="/dashboard/new"
                  className={cn(
                    buttonVariants({ variant: isCoordinator ? "outline" : "default" }),
                    "gap-2 shadow-sm font-semibold"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  Propose New Experience
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-lg border bg-background/60 p-4">
                <p className="text-xs font-medium text-muted-foreground">User ID</p>
                <p className="text-xs font-mono truncate mt-1 text-foreground">{user.id}</p>
              </div>
              <div className="rounded-lg border bg-background/60 p-4">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="text-xs font-medium truncate mt-1 text-foreground">{user.email}</p>
              </div>
              <div className="rounded-lg border bg-background/60 p-4">
                <p className="text-xs font-medium text-muted-foreground">Portal Status</p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Active Session
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Experiences Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Your CAS Experiences</h2>
              <p className="text-sm text-muted-foreground">
                Click any experience to open your portfolio and log reflections ({experiences.length})
              </p>
            </div>
            {experiences.length > 0 && (
              <Link
                href="/dashboard/new"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1 text-xs")}
              >
                <Plus className="h-3.5 w-3.5" />
                New Experience
              </Link>
            )}
          </div>

          {experiences.length === 0 ? (
            /* Empty State */
            <Card className="border-dashed border-2 p-8 text-center bg-card/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <FolderPlus className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold">No CAS experiences proposed yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-5">
                Start building your IB CAS digital portfolio by proposing your first Creativity, Activity, or Service experience.
              </p>
              <Link
                href="/dashboard/new"
                className={cn(buttonVariants(), "gap-2")}
              >
                <Plus className="h-4 w-4" />
                Propose Your First Experience
              </Link>
            </Card>
          ) : (
            /* Experiences Responsive Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((exp) => (
                <Card
                  key={exp.id}
                  className="flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary/40 transition-all border-border bg-card group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/dashboard/experience/${exp.id}`}
                        className="text-lg font-bold leading-snug line-clamp-2 hover:text-primary transition-colors"
                      >
                        {exp.title}
                      </Link>
                      <div className="shrink-0">{getStatusBadge(exp.status)}</div>
                    </div>

                    {/* Strands Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.strands && exp.strands.length > 0 ? (
                        exp.strands.map((strand) => getStrandBadge(strand))
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No strands specified</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Supervisor Information */}
                    {(exp.supervisor_name || exp.supervisor_email) && (
                      <div className="rounded-md border bg-muted/40 p-2.5 text-xs space-y-1">
                        {exp.supervisor_name && (
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Supervisor: {exp.supervisor_name}</span>
                          </div>
                        )}
                        {exp.supervisor_email && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            <span>{exp.supervisor_email}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t bg-muted/20 py-2.5 px-4 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      Submitted: {new Date(exp.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>

                    <Link
                      href={`/dashboard/experience/${exp.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Portfolio &amp; Reflections</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* IB CAS Core Requirements Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">IB CAS Core Requirements</CardTitle>
            <CardDescription>
              Creativity, Activity, Service is a mandatory core component of the IB Diploma Programme.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10 p-4">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Creativity</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Arts and other experiences that involve creative thinking and artistic expression.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 p-4">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">Activity</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Physical exertion contributing to a healthy lifestyle and physical well-being.
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Service</h3>
              <p className="text-xs text-muted-foreground mt-1">
                An unpaid and voluntary exchange with the school or broader community.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}