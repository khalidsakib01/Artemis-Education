import { Layout } from "@/components/layout";
import { useGetCourse, useGetCourseLessons, getGetCourseQueryKey, getGetCourseLessonsQueryKey, useGetUserEnrollments, getGetUserEnrollmentsQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, FileText, CheckCircle2, Star, Users, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseDetail() {
  const { id } = useParams();
  const courseId = Number(id);

  const { data: course, isLoading: isCourseLoading } = useGetCourse(courseId, {
    query: { enabled: !!courseId, queryKey: getGetCourseQueryKey(courseId) }
  });

  const { data: lessons, isLoading: isLessonsLoading } = useGetCourseLessons(courseId, {
    query: { enabled: !!courseId, queryKey: getGetCourseLessonsQueryKey(courseId) }
  });

  const { data: enrollments } = useGetUserEnrollments({
    query: { queryKey: getGetUserEnrollmentsQueryKey() }
  });

  const isEnrolled = enrollments?.some(e => e.courseId === courseId);

  // Group lessons by module
  const modules = course?.modules || [];
  
  if (isCourseLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="p-8 text-center">কোর্স পাওয়া যায়নি।</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pb-24">
        {/* Hero */}
        <div className="bg-card border-b border-border">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[21/9] w-full bg-muted overflow-hidden md:rounded-b-3xl">
              {course.thumbnailUrl ? (
                <img src={course.thumbnailUrl} alt={course.titleBn} className="object-cover w-full h-full" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <PlayCircle className="w-16 h-16 text-primary/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <Badge className="w-fit bg-primary text-primary-foreground mb-3">{course.category}</Badge>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{course.titleBn}</h1>
                <p className="text-white/80 text-sm md:text-base">{course.titleEn}</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">ইন্সট্রাক্টর</span>
                <span className="font-semibold">{course.instructor}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">রেটিং</span>
                <div className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  {course.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">শিক্ষার্থী</span>
                <div className="flex items-center gap-1 font-semibold">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {course.enrolledCount}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">মোট পাঠ</span>
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {course.totalLessons}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">কোর্স সম্পর্কে</h2>
            <p className="text-muted-foreground leading-relaxed">
              {course.descriptionBn || "এই কোর্সটি শিক্ষার্থীদের জন্য বিশেষভাবে তৈরি করা হয়েছে। বিস্তারিত জানতে মডিউলগুলো দেখুন।"}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold">কোর্স মডিউল</h2>
            
            {isLessonsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            ) : modules.length > 0 ? (
              <Accordion type="multiple" className="w-full space-y-3">
                {modules.map((module) => (
                  <AccordionItem key={module.id} value={`module-${module.id}`} className="bg-card border rounded-xl px-4 overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex flex-col items-start text-left">
                        <span className="font-semibold">{module.titleBn}</span>
                        <span className="text-xs text-muted-foreground font-normal mt-1">{module.titleEn}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 space-y-2">
                      {lessons?.filter(l => l.moduleId === module.id).map(lesson => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {lesson.type === 'video' ? (
                              <PlayCircle className="w-5 h-5 text-primary" />
                            ) : lesson.type === 'pdf' ? (
                              <FileText className="w-5 h-5 text-blue-500" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{lesson.titleBn}</span>
                              {lesson.duration && <span className="text-xs text-muted-foreground">{lesson.duration}</span>}
                            </div>
                          </div>
                          {isEnrolled || lesson.isFree ? (
                            <Link href={`/lessons/${lesson.id}`}>
                              <Button variant="ghost" size="sm" className="h-8">
                                {lesson.type === 'quiz' ? 'শুরু করুন' : 'দেখুন'}
                              </Button>
                            </Link>
                          ) : (
                            <div className="w-5 h-5" /> // spacing
                          )}
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center p-8 bg-muted rounded-xl text-muted-foreground">
                মডিউল যোগ করা হচ্ছে...
              </div>
            )}
          </section>
        </div>

        {/* Bottom CTA bar */}
        <div className="fixed bottom-[56px] md:bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">কোর্স ফি</span>
              <div className="flex items-center gap-2">
                {course.originalPrice && course.originalPrice > course.price && (
                  <span className="text-sm text-muted-foreground line-through">৳{course.originalPrice}</span>
                )}
                <span className="text-xl font-bold text-primary">
                  {course.price === 0 ? "Free" : `৳${course.price}`}
                </span>
              </div>
            </div>
            
            {isEnrolled ? (
              <Link href={lessons?.[0] ? `/lessons/${lessons[0].id}` : "#"}>
                <Button size="lg" className="w-full sm:w-auto">
                  চালিয়ে যান
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link href={`/payment/${course.id}`}>
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                  এনরোল করুন
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
