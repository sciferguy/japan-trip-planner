import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignInPage() {
  return (
    <Card className="shadow-zen">
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Access your Japan trip planning dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <Link href="/dashboard">
            <Button className="w-full bg-tea-600 hover:bg-tea-700">
              Continue with Google (Demo)
            </Button>
          </Link>
          <Button variant="outline" className="w-full" disabled>
            Continue with Email (Coming Soon)
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-stone-600">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-tea-600 hover:text-tea-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-stone-500">
            Authentication powered by NextAuth.js v5 & Supabase
          </p>
        </div>
      </CardContent>
    </Card>
  )
}