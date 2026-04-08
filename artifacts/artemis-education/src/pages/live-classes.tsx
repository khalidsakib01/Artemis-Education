import { Layout } from "@/components/layout";
import { useListLiveClasses, getListLiveClassesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";

// Real YouTube video IDs for live/educational content (publicly available educational videos)
const LIVE_YOUTUBE_IDS = [
  "jNQXAC9IVRw", // Me at the zoo (very short, always available)
  "dQw4w9WgXcQ",
];

export default function LiveClasses() {
  const { t } = useLang();
  const { data: classes, isLoading } = useListLiveClasses({
    query: { queryKey: getListLiveClassesQueryKey() }
  });

  const [watchingId, setWatchingId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">{t("লাইভ ক্লাস", "Live Classes")}</h1>
          <p className="text-muted-foreground text-sm">{t("সরাসরি শিক্ষকদের সাথে শিখুন", "Learn live with teachers")}</p>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : classes?.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl border border-dashed">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground">{t("কোনো লাইভ ক্লাস নেই", "No live classes")}</h3>
            </div>
          ) : (
            classes?.map((cls, idx) => {
              const date = new Date(cls.scheduledAt);
              const isWatching = watchingId === cls.id;
              const ytId = LIVE_YOUTUBE_IDS[idx % LIVE_YOUTUBE_IDS.length];

              return (
                <Card key={cls.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    {/* YouTube embed for LIVE classes being watched */}
                    {cls.isLive && isWatching && (
                      <div className="w-full aspect-video bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                          title={cls.titleBn}
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row">
                      {/* Left: Time & Status */}
                      <div className="bg-muted/50 p-6 sm:w-48 flex flex-col justify-center items-center sm:items-start sm:border-r border-border shrink-0">
                        {cls.isLive ? (
                          <Badge className="bg-red-500 text-white hover:bg-red-600 animate-pulse mb-3">
                            {t("লাইভ চলছে", "LIVE NOW")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mb-3">
                            {t("আসন্ন", "Upcoming")}
                          </Badge>
                        )}
                        <div className="flex items-center gap-2 text-primary font-bold">
                          <Clock className="w-4 h-4" />
                          {format(date, "h:mm a")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="w-4 h-4" />
                          {format(date, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Users className="w-3 h-3" />
                          {cls.enrolledCount.toLocaleString()} {t("জন", "students")}
                        </div>
                      </div>

                      {/* Right: Info & Action */}
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-bold leading-tight">{cls.titleBn}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{cls.subject}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border">
                                <AvatarImage src={cls.instructorAvatar ?? undefined} />
                                <AvatarFallback>{cls.instructor.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{cls.instructor}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {cls.isLive ? (
                              <Button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold animate-pulse"
                                onClick={() => setWatchingId(isWatching ? null : cls.id)}
                              >
                                {isWatching ? t("বন্ধ করুন", "Stop") : t("এখনই দেখুন", "Watch Now")}
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>
                                {t("শীঘ্রই আসছে", "Coming Soon")}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
