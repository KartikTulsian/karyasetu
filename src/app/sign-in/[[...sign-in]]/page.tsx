"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignInPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  // Example function you can call if needed
  const handleInvalidUser = async () => {
    await signOut();
    toast.error("Invalid user. Please sign in with a valid account.");
    router.replace("/sign-in");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="mx-auto w-md">
        <SignIn.Root>
          <SignIn.Step
            name="start"
            className="w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
          >
            <div className="text-center space-y-2">
              <Image
                src="/karyasetu_main.png"
                alt="KaryaSetu Logo"
                width={150}
                height={90}
                priority
                className="mx-auto"
              />
              <h1 className="text-3xl font-bold text-gray-800">Sign In Now</h1>
              {/* <p className="text-gray-500">Create. Collaborate. Celebrate.</p> */}
            </div>

            {/* Clerk form */}
            <Clerk.Field name="identifier">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Email
              </Clerk.Label>
              <Clerk.Input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-1 w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <Clerk.Field name="password" className="mt-4">
              <Clerk.Label className="block text-sm font-medium text-gray-700">
                Password
              </Clerk.Label>
              <Clerk.Input
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 w-full border rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Clerk.FieldError className="text-red-600 text-xs mt-1" />
            </Clerk.Field>

            <SignIn.Action
              submit
              className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Sign In
            </SignIn.Action>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <Clerk.Connection
              name="google"
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Image src="/google.png" alt="Google logo" width={18} height={18} />
              Continue with Google
            </Clerk.Connection>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <Clerk.Link
                navigate="sign-up"
                className="font-medium text-indigo-600 hover:underline"
              >
                Sign up
              </Clerk.Link>
            </p>
          </SignIn.Step>
        </SignIn.Root>
      </div>
    </div>
  );
}
