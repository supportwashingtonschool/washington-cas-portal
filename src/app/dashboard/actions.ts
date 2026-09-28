"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function createExperience(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Defensive check: ensure profile exists for foreign key constraint
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle()

  if (!profile) {
    const fullName =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Student User"
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      role: "student",
    })
  }

  const title = (formData.get("title") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()
  const strands = formData.getAll("strands") as string[]
  const supervisor_name = (formData.get("supervisor_name") as string)?.trim()
  const supervisor_email = (formData.get("supervisor_email") as string)?.trim()

  if (!title || !description || strands.length === 0) {
    redirect("/dashboard/new?error=Please+fill+in+all+required+fields+and+select+at+least+one+strand.")
  }

  const { error } = await supabase.from("cas_experiences").insert({
    student_id: user.id,
    title,
    description,
    strands,
    status: "pending",
    supervisor_name: supervisor_name || null,
    supervisor_email: supervisor_email || null,
  })

  if (error) {
    console.error("Error creating CAS experience:", error)
    redirect(`/dashboard/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function updateExperienceStatus(
  experienceId: string,
  newStatus: "approved" | "rejected"
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: Please sign in.")
  }

  // Verify the logged-in user has the coordinator role via the profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profileError || profile?.role !== "coordinator") {
    throw new Error("Forbidden: Only coordinators can update experience statuses.")
  }

  // Update status in cas_experiences
  const { error: updateError } = await supabase
    .from("cas_experiences")
    .update({ status: newStatus })
    .eq("id", experienceId)

  if (updateError) {
    console.error("Failed to update status:", updateError)
    throw new Error(`Failed to update status: ${updateError.message}`)
  }

  revalidatePath("/dashboard")
}
