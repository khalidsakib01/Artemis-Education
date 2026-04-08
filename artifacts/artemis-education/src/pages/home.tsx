import { Layout } from "@/components/layout";
import { useListCourses, useListCategories, getListCoursesQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { CourseCard } from "@/components/course-card";
import { StreakDisplay } from "@/components/streak-display";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: courses, isLoading: isCoursesLoading } = useListCourses(
    { featured: true },
    { query: { queryKey: getListCoursesQueryKey({ featured: true }) } }
  );

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories(
    { query: { queryKey: getListCategoriesQueryKey() } }
  );

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">স্বাগতম, শিক্ষার্থী!</h1>
            <p className="text-muted-foreground text-sm">আজকে কী শিখতে চাও?</p>
          </div>
          <StreakDisplay />
        </header>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-indigo-900 p-6 md:p-10 text-primary-foreground shadow-lg">
          <div className="relative z-10 max-w-md space-y-4">
            <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-accent/20 font-semibold px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              নতুন ব্যাচ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              HSC 2026 Crash Course
            </h2>
            <p className="text-primary-foreground/80">
              দেশের সেরা শিক্ষকদের সাথে প্রস্তুতি নাও ঘরে বসেই।
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto font-bold mt-2">
              বিস্তারিত জানুন
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <BookOpen className="w-64 h-64" />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="কোর্স খুঁজুন..." 
            className="pl-10 h-12 bg-muted/50 border-none rounded-xl text-base"
          />
        </div>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">ক্যাটাগরি</h3>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            {isCategoriesLoading ? (
              Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 flex-shrink-0 rounded-full" />
              ))
            ) : (
              categories?.map((cat) => (
                <Link key={cat.id} href={`/courses?category=${cat.id}`}>
                  <div className="px-5 py-2.5 rounded-full bg-muted/70 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer whitespace-nowrap font-medium text-sm border border-transparent hover:border-primary/20">
                    {cat.nameBn}
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Featured Courses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">চলতে থাকা কোর্সসমূহ</h3>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              সব দেখুন
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

// Inline badge just for the hero to avoid another file if not needed, but we have it from shadcn.
import { Badge } from "@/components/ui/badge";
