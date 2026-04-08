import { Layout } from "@/components/layout";
import { useListLiveClasses, getListLiveClassesQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function LiveClasses() {
  const { data: classes, isLoading } = useListLiveClasses({
    query: { queryKey: getListLiveClassesQueryKey() }
  });

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">লাইভ ক্লাস</h1>
          <p className="text-muted-foreground text-sm">সরাসরি শিক্ষকদের সাথে শিখুন</p>
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
              <h3 className="text-lg font-medium text-muted-foreground">কোনো লাইভ ক্লাস নেই</h3>
            </div>
          ) : (
            classes?.map((cls) => {
              const date = new Date(cls.scheduledAt);
              return (
                <Card key={cls.id} className="rounded-2xl overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Left: Time & Status */}
                      <div className="bg-muted/50 p-6 sm:w-48 flex flex-col justify-center items-center sm:items-start sm:border-r border-border shrink-0">
                        {cls.isLive ? (
                          <Badge className="bg-red-500 text-white hover:bg-red-600 animate-pulse mb-3">
                            লাইভ চলছে
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mb-3">
                            আসন্ন
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
                                <AvatarImage src={cls.instructorAvatar} />
                                <AvatarFallback>{cls.instructor.substring(0,2)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{cls.instructor}</span>
                            </div>
                          </div>
                          
                          <Button 
                            disabled={!cls.isLive}
                            className={cls.isLive ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}
                            onClick={() => cls.joinUrl && window.open(cls.joinUrl, '_blank')}
                          >
                            যোগ দিন
                          </Button>
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
