import { useAppAuth } from "@/contexts/AuthContext";
import { lazy, Suspense } from "react";
import { Link } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const ClerkSignUp = lazy(() => import("@clerk/react").then((module) => ({ default: module.SignUp })));

export default function SignUpPage() {
  const { isAuthEnabled } = useAppAuth();

  if (!isAuthEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-amber-50 p-4">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-foreground">Account creation is unavailable</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Authentication has not been configured for this environment yet. Public pages still work
            while that setup is incomplete.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Go home
            </Link>
            <Link href="/courses" className="rounded-xl border px-4 py-2 text-sm font-medium text-foreground">
              View courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-indigo-50 p-4 dark:to-indigo-950/20">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join Artemis Education and start learning with a cleaner workflow.</p>
        </div>
        <Suspense fallback={<div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-xl">Loading sign up...</div>}>
          <ClerkSignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            appearance={{
              elements: {
                card: "rounded-2xl border border-border shadow-xl",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
