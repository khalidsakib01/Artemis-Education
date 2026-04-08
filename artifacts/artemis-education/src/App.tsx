import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/lessons/:id" component={LessonPlayer} />
      <Route path="/live" component={LiveClasses} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/payment/:courseId" component={Payment} />
      <Route path="/quiz/:id" component={QuizPlayer} />
      <Route path="/quiz/:id/results" component={QuizResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
