import { Layout } from "@/components/layout";
import { CourseCard } from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppAuth } from "@/contexts/AuthContext";
import { useLang } from "@/contexts/LanguageContext";
import {
  getGetUserStreakQueryKey,
  getListCategoriesQueryKey,
  getListCoursesQueryKey,
  useGetUserStreak,
  useListCategories,
  useListCourses,
} from "@workspace/api-client-react";
import { BookOpen, Flame, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { t } = useLang();
  const { user } = useAppAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const { data: courses, isLoading: isCoursesLoading } = useListCourses(
    { featured: true },
    { query: { queryKey: getListCoursesQueryKey({ featured: true }) } },
  );

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() },
  });

  const { data: streak } = useGetUserStreak({
    query: { queryKey: getGetUserStreakQueryKey() },
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (search.trim()) {
      setLocation(`/courses?search=${encodeURIComponent(search)}`);
    }
  };

  const displayName =
    user?.firstName || user?.email?.split("@")[0] || t("\u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0", "Student");

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              {t(`\u09b8\u09cd\u09ac\u09be\u0997\u09a4, ${displayName}!`, `Welcome, ${displayName}!`)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("\u0986\u099c \u0986\u09aa\u09a8\u09bf \u0995\u09c0 \u09b6\u09bf\u0996\u09a4\u09c7 \u099a\u09be\u09a8?", "What do you want to learn today?")}
            </p>
          </div>
          {streak && streak.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-500/10 px-3 py-1.5 text-amber-600 dark:border-amber-800 dark:text-amber-400">
              <Flame className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold">
                {streak.currentStreak} {t("\u09a6\u09bf\u09a8", "days")}
              </span>
            </div>
          )}
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-900 p-6 text-primary-foreground shadow-lg md:p-10">
          <div className="relative z-10 max-w-md space-y-4">
            <Badge className="border-amber-400/20 bg-amber-400/20 px-3 py-1 font-semibold text-amber-300 hover:bg-amber-400/30">
              <Sparkles className="mr-1 h-3 w-3" />
              {t("\u09a8\u09a4\u09c1\u09a8 \u09ac\u09cd\u09af\u09be\u099a", "New Batch")}
            </Badge>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">HSC 2026 Crash Course</h2>
            <p className="text-primary-foreground/80">
              {t(
                "\u09a6\u09c7\u09b6\u09c7\u09b0 \u09b8\u09c7\u09b0\u09be \u09b6\u09bf\u0995\u09cd\u09b7\u0995\u09a6\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09ac\u09be\u09b8\u09be \u09a5\u09c7\u0995\u09c7\u0987 \u09aa\u09cd\u09b0\u09b8\u09cd\u09a4\u09c1\u09a4\u09bf \u09a8\u09bf\u09a8\u0964",
                "Prepare with the country's best teachers from home.",
              )}
            </p>
            <Button
              size="lg"
              className="mt-2 w-full bg-amber-500 font-bold text-slate-900 hover:bg-amber-400 sm:w-auto"
              onClick={() => setLocation("/courses?category=hsc")}
            >
              {t("\u0986\u09b0\u0993 \u09a6\u09c7\u0996\u09c1\u09a8", "Learn More")}
            </Button>
          </div>

          <div className="pointer-events-none absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 transform opacity-10">
            <BookOpen className="h-64 w-64" />
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("\u0995\u09cb\u09b0\u09cd\u09b8 \u0996\u09c1\u0981\u099c\u09c1\u09a8...", "Search courses...")}
              className="h-12 rounded-xl border-none bg-muted/50 pl-10 text-base"
            />
          </div>
        </form>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t("\u0995\u09cd\u09af\u09be\u099f\u09be\u0997\u09b0\u09bf", "Categories")}</h3>
          </div>

          <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
            {isCategoriesLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className="h-10 w-24 flex-shrink-0 rounded-full" />
                  ))
              : categories?.map((category) => (
                  <Link key={category.id} href={`/courses?category=${category.id}`}>
                    <div className="cursor-pointer whitespace-nowrap rounded-full border border-transparent bg-muted/70 px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/20 hover:bg-primary/10 hover:text-primary">
                      {t(category.nameBn, category.nameEn)}
                    </div>
                  </Link>
                ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{t("\u09b6\u09bf\u0996\u09be \u099a\u09be\u09b2\u09bf\u09af\u09bc\u09c7 \u09af\u09be\u09a8", "Continue Learning")}</h3>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              {t("\u09b8\u09ac \u09a6\u09c7\u0996\u09c1\u09a8", "See all")}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isCoursesLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="aspect-video w-full rounded-xl" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))
              : courses?.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>
      </div>
    </Layout>
  );
}
