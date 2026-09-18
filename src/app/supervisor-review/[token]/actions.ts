"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function verifyExperience(token: string) {
  if (!token) {
    throw new Error("Invalid or missing supervisor token.")
  }

  const supabase = await createClient()

  // Query experience matching supervisor_token
  const { data: experience, error: fetchError } = await supabase
    .from("cas_experiences")
    .select("id, status")
    .eq("supervisor_token", token)
    .maybeSingle()

  if (fetchError || !experience) {
    console.error("Experience not found for token:", fetchError)
    throw new Error("Experience not found or link has expired.")
  }

  // Update status to 'completed'
  const { error: updateError } = await supabase
    .from("cas_experiences")
    .update({ status: "completed" })
    .eq("supervisor_token", token)

  if (updateError) {
    console.error("Failed to verify experience:", updateError)
    throw new Error(`Failed to update experience: ${updateError.message}`)
  }

  revalidatePath(`/supervisor-review/${token}`)
  revalidatePath("/dashboard")
  revalidatePath("/coordinator")
}