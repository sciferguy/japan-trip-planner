import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  // Redirect authenticated users to dashboard
  redirect("/dashboard");
}