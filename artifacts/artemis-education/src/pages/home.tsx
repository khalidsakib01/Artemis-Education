import { Layout } from "@/components/layout";
import { useListCourses, useListCategories, getListCoursesQueryKey, getListCategoriesQueryKey, useGetUserStreak, getGetUserStreakQueryKey } from "@workspace/api-client-react";
import { CourseCard } from "@/components/course-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, BookOpen, Flame } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useLang } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/react";
import { useState } from "react";

export default function Home() {
  const { t } = useLang();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const { data: courses, isLoading: isCoursesLoading } = useListCourses(
    { featured: true },
    { query: { queryKey: getListCoursesQueryKey({ featured: true }) } }
  );

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories(
    { query: { queryKey: getListCategoriesQueryKey() } }
  );

  const { data: streak } = useGetUserStreak({
    query: { queryKey: getGetUserStreakQueryKey() }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) setLocation(`/courses?search=${encodeURIComponent(search)}`);
  };

  const displayName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || t("শিক্ষার্থী", "Student");

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
              {t(`স্বাগতম, ${displayName}!`, `Welcome, ${displayName}!`)}
            </h1>
            <p className="text-muted-foreground text-sm" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
              {t("আজকে কী শিখতে চাও?", "What do you want to learn today?")}
            </p>
          </div>
          {streak && streak.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 fill-current" />
              <span className="font-bold text-sm">{streak.currentStreak} {t("দিন", "days")}</span>
            </div>
          )}
        </header>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-900 p-6 md:p-10 text-primary-foreground shadow-lg">
          <div className="relative z-10 max-w-md space-y-4">
            <Badge className="bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border-amber-400/20 font-semibold px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              {t("নতুন ব্যাচ", "New Batch")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
              HSC 2026 Crash Course
            </h2>
            <p className="text-primary-foreground/80" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
              {t("দেশের সেরা শিক্ষকদের সাথে প্রস্তুতি নাও ঘরে বসেই।", "Prepare with the country's best teachers from home.")}
            </p>
            <Button
              size="lg"
              className="bg-amber-500 text-slate-900 hover:bg-amber-400 w-full sm:w-auto font-bold mt-2"
              onClick={() => setLocation("/courses?category=hsc")}
            >
              {t("বিস্তারিত জানুন", "Learn More")}
            </Button>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <BookOpen className="w-64 h-64" />
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("কোর্স খুঁজুন...", "Search courses...")}
              className="pl-10 h-12 bg-muted/50 border-none rounded-xl text-base"
            />
          </div>
        </form>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{t("ক্যাটাগরি", "Categories")}</h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {isCategoriesLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 flex-shrink-0 rounded-full" />
              ))
            ) : (
              categories?.map((cat) => (
                <Link key={cat.id} href={`/courses?category=${cat.id}`}>
                  <div className="px-5 py-2.5 rounded-full bg-muted/70 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer whitespace-nowrap font-medium text-sm border border-transparent hover:border-primary/20" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
                    {t(cat.nameBn, cat.nameEn)}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Featured Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>{t("চলতে থাকা কোর্সসমূহ", "Continue Learning")}</h3>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>
              {t("সব দেখুন", "See all")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {isCoursesLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-video rounded-xl" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              courses?.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
}
