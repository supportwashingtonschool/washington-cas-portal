"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function addReflection(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized: You must be logged in to add a reflection.")
  }

  const experienceId = formData.get("experience_id") as string
  const content = (formData.get("content") as string)?.trim()

  if (!experienceId || !content) {
    throw new Error("Reflection content cannot be empty.")
  }

  // Insert reflection into the reflections table
  const { error } = await supabase.from("reflections").insert({
    experience_id: experienceId,
    content: content,
  })

  if (error) {
    console.error("Error inserting reflection:", error)
    throw new Error(`Failed to add reflection: ${error.message}`)
  }

  revalidatePath(`/dashboard/experience/${experienceId}`)
  revalidatePath("/dashboard")
}