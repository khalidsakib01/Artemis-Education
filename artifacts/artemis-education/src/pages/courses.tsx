import { Layout } from "@/components/layout";
import { useListCourses, useListCategories, getListCoursesQueryKey, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { CourseCard } from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>();

  const { data: courses, isLoading: isCoursesLoading } = useListCourses(
    { search, category },
    { query: { queryKey: getListCoursesQueryKey({ search, category }) } }
  );

  const { data: categories } = useListCategories(
    { query: { queryKey: getListCategoriesQueryKey() } }
  );

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">কোর্সসমূহ</h1>
          <p className="text-muted-foreground text-sm">আপনার পছন্দের কোর্সটি বেছে নিন</p>
        </header>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="কোর্স খুঁজুন..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-card border-border rounded-xl text-base"
            />
          </div>
          <Button variant="outline" className="h-12 w-12 p-0 shrink-0 rounded-xl">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          <Button 
            variant={!category ? "default" : "outline"}
            className="rounded-full shrink-0"
            onClick={() => setCategory(undefined)}
          >
            সব কোর্স
          </Button>
          {categories?.map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "default" : "outline"}
              className="rounded-full shrink-0"
              onClick={() => setCategory(cat.id)}
            >
              {cat.nameBn}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {isCoursesLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-3 bg-card p-0 rounded-xl overflow-hidden border">
                <Skeleton className="w-full aspect-video rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="pt-4 flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : courses?.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">কোনো কোর্স পাওয়া যায়নি।</p>
            </div>
          ) : (
            courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}
