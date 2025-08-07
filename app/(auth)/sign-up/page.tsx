import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { signIn } from "@/auth"

export default function SignUpPage() {
  return (
    <Card className="shadow-zen">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Start planning your Japan adventure
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard" })
            }}
          >
            <Button type="submit" className="w-full bg-tea-600 hover:bg-tea-700">
              Continue with Google
            </Button>
          </form>
          <Button variant="outline" className="w-full" disabled>
            Continue with Email (Coming Soon)
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-stone-600">
            Already have an account?{" "}
            <a href="/sign-in" className="text-tea-600 hover:text-tea-700 font-medium">
              Sign in
            </a>
          </p>
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-stone-500">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </CardContent>
    </Card>
  )
}