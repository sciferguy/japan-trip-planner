"use client";
// components/AuthStatus.tsx
"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export function AuthStatus() {
  const { data, status } = useSession();
  if (status === "loading") return <span>Loading...</span>;
  if (!data?.user) return <button onClick={() => signIn()}>Sign in</button>;
  return (
    <div>
      <span>{data.user.email}</span>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
