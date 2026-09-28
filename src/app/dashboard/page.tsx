import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/login/actions"
import { Button } from "@/components/ui/button"
import { GraduationCap, LogOut } from "lucide-react"
import StudentDashboard, { Profile } from "@/components/dashboard/StudentDashboard"
import CoordinatorDashboard from "@/components/dashboard/CoordinatorDashboard"

export const metadata = {
  title: "Dashboard | Washington School CAS Portal",
  description: "IB CAS Digital Portfolio Portal for Washington School",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch authenticated user's profile
  const { data: rawProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()

  const profile: Profile = rawProfile || {
    id: user.id,
    full_name:
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User",
    role: "student",
  }

  const isCoordinator = profile.role === "coordinator"

  // If coordinator, fetch pending proposals with student profiles and all registered students
  if (isCoordinator) {
    const [pendingRes, studentsRes] = await Promise.all([
      supabase
        .from("cas_experiences")
        .select("*, profiles(full_name)")
        .eq("status", "pending")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false }),
    ])

    return (
      <div className="min-h-screen bg-muted/30 pb-16">
        {/* Top Navbar */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
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
                  Coordinator Control Center
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-medium">{profile.full_name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {profile.role}
                </span>
              </div>

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

        <main className="container mx-auto max-w-5xl py-8 px-4 sm:px-6">
          <CoordinatorDashboard
            profile={profile}
            allPendingExperiences={pendingRes.data || []}
            allStudents={studentsRes.data || []}
          />
        </main>
      </div>
    )
  }

  // If student, fetch their personal CAS experiences
  const { data: experiences } = await supabase
    .from("cas_experiences")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Top Navbar */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none sm:text-base">
                Washington School
              </h1>
              <p className="text-xs text-muted-foreground">
                IB CAS Portfolio Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-medium">{profile.full_name}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {profile.role}
              </span>
            </div>

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

      <main className="container mx-auto max-w-5xl py-8 px-4 sm:px-6">
        <StudentDashboard
          profile={profile}
          experiences={experiences || []}
          userEmail={user.email}
        />
      </main>
    </div>
  )
}