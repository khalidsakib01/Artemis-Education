import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { setBaseUrl } from "@workspace/api-client-react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppAuthProvider, useAppAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CourseDetail from "@/pages/course-detail";
import Courses from "@/pages/courses";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import LessonPlayer from "@/pages/lesson-player";
import LiveClasses from "@/pages/live-classes";
import NotFound from "@/pages/not-found";
import Payment from "@/pages/payment";
import Profile from "@/pages/profile";
import QuizPlayer from "@/pages/quiz-player";
import QuizResults from "@/pages/quiz-results";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const runtimeApiBaseUrl =
  typeof window !== "undefined" &&
  (window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost")
    ? `${window.location.protocol}//${window.location.hostname}:8080`
    : null;
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8080" : runtimeApiBaseUrl);
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

setBaseUrl(apiBaseUrl || null);

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

function ProtectedRoute({ component: Component }: { component: ComponentType }) {
  const { isSignedIn } = useAppAuth();

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  return <Component />;
}

function HomeRoute() {
  const { isSignedIn } = useAppAuth();

  if (isSignedIn) {
    return <Redirect to="/home" />;
  }

  return <LandingPage />;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={HomeRoute} />
      <Route path="/home" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/lessons/:id" component={() => <ProtectedRoute component={LessonPlayer} />} />
      <Route path="/live" component={LiveClasses} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/payment/:courseId" component={() => <ProtectedRoute component={Payment} />} />
      <Route path="/quiz/:id" component={() => <ProtectedRoute component={QuizPlayer} />} />
      <Route path="/quiz/:id/results" component={() => <ProtectedRoute component={QuizResults} />} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppProviders() {
  const [, setLocation] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <AppAuthProvider
            publishableKey={clerkPubKey}
            proxyUrl={clerkProxyUrl}
            routerPush={(to) => setLocation(stripBase(to))}
            routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
          >
            <AppRoutes />
            <Toaster />
          </AppAuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <AppProviders />
    </WouterRouter>
  );
}

function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,#020617_0%,#172554_48%,#0f172a_100%)] text-white">
      <nav className="flex items-center justify-between border-b border-white/10 p-4 md:px-12 md:py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-slate-950 shadow-lg">
            A
          </div>
          <div>
            <div className="text-lg font-bold leading-tight">Artemis Education</div>
            <div className="text-xs font-medium leading-tight text-indigo-200">
              Smart learning for ambitious students
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/sign-in")}
            className="px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Sign in
          </button>
          <button
            onClick={() => setLocation("/sign-up")}
            className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg transition-colors hover:bg-amber-400"
          >
            Get started
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-16 text-center md:px-12 md:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
          HSC 2026 preparation, live classes, and practice tests
        </div>

        <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
          Learn with structure,
          <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            {" "}study with confidence
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-indigo-100 md:text-xl">
          Explore courses, watch upcoming live sessions, and practice with a
          focused learning experience built for students who want momentum.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => setLocation("/sign-up")}
            className="rounded-2xl bg-amber-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-xl transition-all hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-amber-500/30"
          >
            Create your account
          </button>
          <button
            onClick={() => setLocation("/courses")}
            className="rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/20"
          >
            Browse courses
          </button>
        </div>

        <div className="mx-auto grid max-w-lg grid-cols-3 gap-6 pt-8">
          {[
            { value: "12k+", label: "Active learners" },
            { value: "240+", label: "Lessons" },
            { value: "92%", label: "Completion focus" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-extrabold text-amber-300 md:text-3xl">
                {item.value}
              </div>
              <div className="mt-1 text-sm text-indigo-200">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 pb-20 sm:grid-cols-3 md:px-12">
        {[
          {
            icon: "AI",
            title: "Organized paths",
            desc: "Move from discovery to exam prep with one clear learning flow.",
          },
          {
            icon: "QS",
            title: "Quick study",
            desc: "Find lessons and courses fast without fighting the interface.",
          },
          {
            icon: "LC",
            title: "Live support",
            desc: "Keep track of upcoming classes and stay close to teachers.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-amber-300">
              {feature.icon}
            </div>
            <div className="text-lg font-bold">{feature.title}</div>
            <div className="text-sm text-indigo-100">{feature.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
