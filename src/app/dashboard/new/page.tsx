import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { logout } from "@/app/login/actions"
import { Button, buttonVariants } from "@/components/ui/button"
import { GraduationCap, ArrowLeft, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { cn } from "@/lib/utils"
import ExperienceForm from "./experience-form"

export const metadata = {
  title: "Propose CAS Experience | Washington School",
  description: "Submit a new IB CAS experience for coordinator review",
}

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { error } = await searchParams

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-background/75 backdrop-blur-md sticky top-0 z-30 shadow-xs dark:bg-background/65 dark:border-white/10">
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
            <ThemeToggle />

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

      <ExperienceForm error={error} />
    </div>
  )
}