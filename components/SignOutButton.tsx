"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-stone-600 dark:text-stone-300 hover:text-stone-800 dark:hover:text-white font-medium transition-colors px-4 py-2 rounded-md hover:bg-stone-100 dark:hover:bg-gray-700 flex items-center space-x-1"
    >
      <span className="text-sm">[→</span>
      <span>Sign Out</span>
    </button>
  );
}