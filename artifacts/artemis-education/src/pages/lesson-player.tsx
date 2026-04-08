import { Layout } from "@/components/layout";
import { useGetLesson, getGetLessonQueryKey, useGetCourseLessons, getGetCourseLessonsQueryKey, useUpdateLessonProgress } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LessonPlayer() {
  const { id } = useParams();
  const lessonId = Number(id);
  const { toast } = useToast();

  const { data: lesson, isLoading: isLessonLoading } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) }
  });

  const { data: allLessons } = useGetCourseLessons(lesson?.courseId || 0, {
    query: { enabled: !!lesson?.courseId, queryKey: getGetCourseLessonsQueryKey(lesson?.courseId || 0) }
  });

  const updateProgress = useUpdateLessonProgress();
  const [isCompleted, setIsCompleted] = useState(false);

  const handleMarkComplete = () => {
    if (!lesson) return;
    
    setIsCompleted(true);
    updateProgress.mutate({
      data: {
        lessonId: lesson.id,
        courseId: lesson.courseId,
        completed: true
      }
    }, {
      onSuccess: () => {
        toast({
          title: "অভিনন্দন!",
          description: "পাঠটি সম্পন্ন হয়েছে।",
        });
      },
      onError: () => {
        setIsCompleted(false);
        toast({
          variant: "destructive",
          title: "ত্রুটি",
          description: "প্রোগ্রেস আপডেট করা যায়নি।",
        });
      }
    });
  };

  if (isLessonLoading) {
    return (
      <Layout>
        <div className="p-4 space-y-4">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </Layout>
    );
  }

  if (!lesson) {
    return <Layout><div className="p-8 text-center">পাঠ পাওয়া যায়নি।</div></Layout>;
  }

  // Find prev/next lessons
  const currentIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentIndex + 1] : null;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] md:h-screen">
        
        {/* Player Section */}
        <div className="flex-1 flex flex-col bg-background h-full overflow-y-auto">
          <div className="w-full bg-black aspect-video relative flex items-center justify-center shrink-0">
            {lesson.type === 'video' && lesson.videoUrl ? (
              <iframe 
                src={lesson.videoUrl} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : lesson.type === 'pdf' ? (
              <div className="flex flex-col items-center justify-center text-white">
                <FileText className="w-16 h-16 mb-4 text-blue-400" />
                <Button>পিডিএফ ডাউনলোড করুন</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <CheckCircle2 className="w-16 h-16 mb-4 text-green-400" />
                <Link href={`/quiz/${lesson.id}`}>
                  <Button>কুইজ শুরু করুন</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{lesson.titleBn}</h1>
              <p className="text-muted-foreground">{lesson.titleEn}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border">
              <Button 
                onClick={handleMarkComplete}
                variant={isCompleted ? "default" : "outline"}
                className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isCompleted ? "সম্পন্ন" : "সম্পন্ন হিসেবে মার্ক করুন"}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4">
              {prevLesson ? (
                <Link href={`/lessons/${prevLesson.id}`}>
                  <Button variant="ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    পূর্ববর্তী
                  </Button>
                </Link>
              ) : <div />}

              {nextLesson && (
                <Link href={`/lessons/${nextLesson.id}`}>
                  <Button>
                    পরবর্তী পাঠ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Playlist */}
        <div className="w-full lg:w-80 xl:w-96 bg-card border-l border-border flex flex-col shrink-0 lg:h-full">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold">কোর্সের পাঠসমূহ</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {allLessons?.map((l) => {
                const isActive = l.id === lesson.id;
                return (
                  <Link key={l.id} href={`/lessons/${l.id}`}>
                    <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}>
                      <div className="mt-0.5">
                        {l.type === 'video' ? <PlayCircle className="w-4 h-4" /> : 
                         l.type === 'pdf' ? <FileText className="w-4 h-4" /> : 
                         <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium line-clamp-2 ${isActive ? "font-bold" : ""}`}>
                          {l.titleBn}
                        </p>
                        {l.duration && (
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {l.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </div>

      </div>
    </Layout>
  );
}
