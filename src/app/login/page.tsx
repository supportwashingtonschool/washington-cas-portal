import LoginForm from "./login-form"

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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-muted/30 to-background">
      <LoginForm error={error} message={message} />
    </main>
  )
}