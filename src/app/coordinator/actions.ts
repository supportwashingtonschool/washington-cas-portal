"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

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

  // Revalidate affected paths
  revalidatePath("/coordinator")
  revalidatePath("/dashboard")
}