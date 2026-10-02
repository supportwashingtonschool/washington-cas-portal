import LoginForm from "./login-form"
import { ThemeToggle } from "@/components/ThemeToggle"

export const metadata = {
  title: "Login | Washington School CAS Portal",
  description: "Sign in or sign up to your IB CAS Digital Portfolio portal",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const { error, message } = await searchParams

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <LoginForm error={error} message={message} />
    </main>
  )
}