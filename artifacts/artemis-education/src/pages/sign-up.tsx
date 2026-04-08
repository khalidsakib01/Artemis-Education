import { SignUp } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-indigo-50 dark:to-indigo-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">আর্টেমিস এডুকেশন</h1>
          <p className="text-muted-foreground text-sm">বিনামূল্যে অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
          appearance={{
            elements: {
              card: "shadow-xl border border-border rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }}
        />
      </div>
    </div>
  );
}
