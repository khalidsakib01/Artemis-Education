import { useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, Show, useClerk } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";
import LessonPlayer from "@/pages/lesson-player";
import LiveClasses from "@/pages/live-classes";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Leaderboard from "@/pages/leaderboard";
import Payment from "@/pages/payment";
import QuizPlayer from "@/pages/quiz-player";
import QuizResults from "@/pages/quiz-results";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <>
      <Show when="signed-in">
        <Component />
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function HomeRoute() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/home" />
      </Show>
      <Show when="signed-out">
        <LandingPage />
      </Show>
    </>
  );
}

function Router() {
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

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <LanguageProvider>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;

// Landing page for unauthenticated users
function LandingPage() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between p-4 md:px-12 md:py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-bold text-slate-900 text-lg shadow">A</div>
          <div>
            <div className="font-bold text-lg leading-tight">Artemis Education</div>
            <div className="text-xs text-indigo-300 leading-tight font-medium" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>আর্টেমিস এডুকেশন</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/sign-in")}
            className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            লগইন
          </button>
          <button
            onClick={() => setLocation("/sign-up")}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors shadow-lg"
          >
            শুরু করুন
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 py-16 md:py-24 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse inline-block"></span>
          HSC 2026 ব্যাচ চলছে
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
          স্মার্টভাবে শিখুন,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">সফলতা অর্জন করুন</span>
        </h1>

        <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
          বাংলাদেশের সেরা শিক্ষকদের সাথে HSC, SSC ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার প্রস্তুতি নিন।
          ভিডিও ক্লাস, লাইভ ক্লাস, কুইজ ও সার্টিফিকেট — সবকিছু এক জায়গায়।
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation("/sign-up")}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-2xl text-lg transition-all shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
          >
            বিনামূল্যে শুরু করুন
          </button>
          <button
            onClick={() => setLocation("/courses")}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl text-lg transition-all"
          >
            কোর্সসমূহ দেখুন
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto pt-8">
          {[
            { value: "৫০,০০০+", label: "শিক্ষার্থী" },
            { value: "১৫০+", label: "কোর্স" },
            { value: "৯৮%", label: "সাফল্যের হার" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-400" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{s.value}</div>
              <div className="text-sm text-indigo-300 mt-1" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 md:px-12 pb-20 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: "📹", title: "রেকর্ডেড ক্লাস", desc: "যেকোনো সময়, যেকোনো জায়গায় শিখুন" },
          { icon: "🔴", title: "লাইভ ক্লাস", desc: "সরাসরি শিক্ষকের সাথে প্রশ্ন করুন" },
          { icon: "🏆", title: "সার্টিফিকেট", desc: "কোর্স সম্পন্ন করে সার্টিফিকেট পান" },
        ].map((f) => (
          <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:bg-white/10 transition-colors">
            <div className="text-3xl">{f.icon}</div>
            <div className="font-bold text-lg" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{f.title}</div>
            <div className="text-indigo-300 text-sm" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
