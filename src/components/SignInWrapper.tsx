"use client";

import { useSearchParams } from "next/navigation";

export function SignInErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <p className="text-red-600 text-center text-sm mb-4">
      {error === "invalidUser" && "Invalid email. Please sign in with a valid account."}
      {error === "unauthenticated" && "Please sign in to continue."}
    </p>
  );
}
