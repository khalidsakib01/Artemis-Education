import { Layout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/contexts/LanguageContext";
import { getListLiveClassesQueryKey, useListLiveClasses } from "@workspace/api-client-react";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const LIVE_YOUTUBE_IDS = ["jNQXAC9IVRw", "dQw4w9WgXcQ"];

export default function LiveClasses() {
  const { t } = useLang();
  const { data: classes, isLoading } = useListLiveClasses({
    query: { queryKey: getListLiveClassesQueryKey() },
  });
  const [watchingId, setWatchingId] = useState<number | null>(null);

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">{t("\u09b2\u09be\u0987\u09ad \u0995\u09cd\u09b2\u09be\u09b8", "Live Classes")}</h1>
          <p className="text-sm text-muted-foreground">{t("\u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09b6\u09bf\u0995\u09cd\u09b7\u0995\u09a6\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09b6\u09bf\u0996\u09c1\u09a8", "Learn live with teachers")}</p>
        </header>

        <div className="space-y-4">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="rounded-2xl">
                  <CardContent className="flex flex-col gap-6 p-6 sm:flex-row">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : classes?.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card py-12 text-center">
              <Video className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground">{t("\u0995\u09cb\u09a8\u09cb \u09b2\u09be\u0987\u09ad \u0995\u09cd\u09b2\u09be\u09b8 \u09a8\u09c7\u0987", "No live classes")}</h3>
            </div>
          ) : (
            classes?.map((cls, index) => {
              const date = new Date(cls.scheduledAt);
              const isWatching = watchingId === cls.id;
              const ytId = LIVE_YOUTUBE_IDS[index % LIVE_YOUTUBE_IDS.length];

              return (
                <Card key={cls.id} className="overflow-hidden rounded-2xl transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    {cls.isLive && isWatching && (
                      <div className="aspect-video w-full bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full"
                          title={cls.titleBn}
                        />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row">
                      <div className="shrink-0 border-border bg-muted/50 p-6 sm:w-48 sm:border-r">
                        {cls.isLive ? (
                          <Badge className="mb-3 animate-pulse bg-red-500 text-white hover:bg-red-600">{t("\u09b2\u09be\u0987\u09ad \u099a\u09b2\u099b\u09c7", "LIVE NOW")}</Badge>
                        ) : (
                          <Badge variant="outline" className="mb-3">{t("\u0986\u09b8\u09a8\u09cd\u09a8", "Upcoming")}</Badge>
                        )}
                        <div className="flex items-center gap-2 font-bold text-primary"><Clock className="h-4 w-4" />{format(date, "h:mm a")}</div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{format(date, "MMM d, yyyy")}</div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-3 w-3" />{cls.enrolledCount.toLocaleString()} {t("\u099c\u09a8", "students")}</div>
                      </div>

                      <div className="flex flex-1 flex-col justify-center p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-bold leading-tight">{cls.titleBn}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">{cls.subject}</p>
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
                              <Button className="animate-pulse bg-red-500 font-bold text-white hover:bg-red-600" onClick={() => setWatchingId(isWatching ? null : cls.id)}>
                                {isWatching ? t("\u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09c1\u09a8", "Stop") : t("\u098f\u0996\u09a8\u0987 \u09a6\u09c7\u0996\u09c1\u09a8", "Watch Now")}
                              </Button>
                            ) : (
                              <Button variant="outline" disabled>{t("\u09b6\u09c0\u0998\u09cd\u09b0\u0987 \u0986\u09b8\u099b\u09c7", "Coming Soon")}</Button>
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
