import { Layout } from "@/components/layout";
import { CourseCard } from "@/components/course-card";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getListCategoriesQueryKey, getListCoursesQueryKey, useListCategories, useListCourses } from "@workspace/api-client-react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Courses() {
  const { t } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>();

  const { data: courses, isLoading: isCoursesLoading } = useListCourses(
    { search, category },
    { query: { queryKey: getListCoursesQueryKey({ search, category }) } },
  );

  const { data: categories } = useListCategories({
    query: { queryKey: getListCategoriesQueryKey() } },
  );

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">{t("\u0995\u09cb\u09b0\u09cd\u09b8\u09b8\u09ae\u09c2\u09b9", "Courses")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("\u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u099b\u09a8\u09cd\u09a6\u09c7\u09b0 \u0995\u09cb\u09b0\u09cd\u09b8 \u09ac\u09c7\u099b\u09c7 \u09a8\u09bf\u09a8", "Choose the course that fits your goals.")}
          </p>
        </header>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("\u0995\u09cb\u09b0\u09cd\u09b8 \u0996\u09c1\u0981\u099c\u09c1\u09a8...", "Search courses...")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 rounded-xl border-border bg-card pl-10 text-base"
            />
          </div>
          <Button variant="outline" className="h-12 w-12 shrink-0 rounded-xl p-0" aria-label="Filters">
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>

        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          <Button
            variant={!category ? "default" : "outline"}
            className="shrink-0 rounded-full"
            onClick={() => setCategory(undefined)}
          >
            {t("\u09b8\u09ac \u0995\u09cb\u09b0\u09cd\u09b8", "All Courses")}
          </Button>
          {categories?.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              className="shrink-0 rounded-full"
              onClick={() => setCategory(cat.id)}
            >
              {t(cat.nameBn, cat.nameEn)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {isCoursesLoading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border bg-card">
                  <Skeleton className="aspect-video w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </div>
              ))
          ) : courses?.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">{t("\u0995\u09cb\u09a8\u09cb \u0995\u09cb\u09b0\u09cd\u09b8 \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df\u09a8\u09bf\u0964", "No courses found.")}</p>
            </div>
          ) : (
            courses?.map((course) => <CourseCard key={course.id} course={course} />)
          )}
        </div>
      </div>
    </Layout>
  );
}
