import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
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
    <div className="min-h-screen bg-muted/30">
      <ExperienceForm error={error} />
    </div>
  )
}