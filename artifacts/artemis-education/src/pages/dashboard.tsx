import { Layout } from "@/components/layout";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle2, Flame, Trophy, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });

  const stats = [
    { label: "এনরোলড কোর্স", value: summary?.enrolledCourses ?? 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "সম্পন্ন পাঠ", value: summary?.totalLessonsCompleted ?? 0, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "বর্তমান স্ট্রাইক", value: `${summary?.currentStreak ?? 0} দিন`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "মোট পয়েন্ট", value: summary?.totalPoints ?? 0, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-primary mb-1">আমার ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground text-sm">আপনার শেখার অগ্রগতি এক নজরে</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="p-6 space-y-2">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, i) => (
              <Card key={i} className="rounded-2xl overflow-hidden border-none shadow-sm bg-card">
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-full ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold">সাম্প্রতিক কার্যকলাপ</h2>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : summary?.recentActivity?.length ? (
                  <div className="divide-y border-border">
                    {summary.recentActivity.map((activity, i) => (
                      <div key={i} className="p-4 sm:p-6 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                        <div className="mt-1 p-2 bg-primary/10 rounded-full shrink-0">
                          {activity.type === 'lesson_completed' ? <CheckCircle2 className="w-4 h-4 text-primary" /> :
                           activity.type === 'quiz_taken' ? <BookOpen className="w-4 h-4 text-primary" /> :
                           <Clock className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">{activity.titleBn}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </span>
                            {activity.points && (
                              <span className="text-xs font-bold text-amber-500">+{activity.points} pts</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    কোনো কার্যকলাপ নেই
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-primary to-indigo-900 text-white border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="text-orange-400" />
                  ডেইলি টার্গেট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>আজকের অগ্রগতি</span>
                      <span className="font-bold">৬০%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-orange-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-white/80">আর ২ টি পাঠ সম্পন্ন করলে আজকের টার্গেট পূরণ হবে!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </Layout>
  );
}
