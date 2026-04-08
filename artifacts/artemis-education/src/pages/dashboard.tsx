import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/contexts/LanguageContext";
import { getGetDashboardSummaryQueryKey, useGetDashboardSummary } from "@workspace/api-client-react";
import { BookOpen, CheckCircle2, Clock, Flame, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { t } = useLang();
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });

  const stats = [
    { label: t("\u098f\u09a8\u09b0\u09cb\u09b2 \u0995\u09cb\u09b0\u09cd\u09b8", "Enrolled Courses"), value: summary?.enrolledCourses ?? 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: t("\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8 \u09aa\u09be\u09a0", "Completed Lessons"), value: summary?.totalLessonsCompleted ?? 0, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
    { label: t("\u099a\u09b2\u09ae\u09be\u09a8 \u09b8\u09cd\u099f\u09cd\u09b0\u09c0\u0995", "Current Streak"), value: `${summary?.currentStreak ?? 0} ${t("\u09a6\u09bf\u09a8", "days")}`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: t("\u09ae\u09cb\u099f \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f", "Total Points"), value: summary?.totalPoints ?? 0, icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
        <header>
          <h1 className="mb-1 text-2xl font-bold text-primary">{t("\u0986\u09ae\u09be\u09b0 \u09a1\u09cd\u09af\u09be\u09b6\u09ac\u09cb\u09b0\u09cd\u09a1", "My Dashboard")}</h1>
          <p className="text-sm text-muted-foreground">{t("\u0986\u09aa\u09a8\u09be\u09b0 \u09b6\u09bf\u0996\u09be\u09b0 \u0985\u0997\u09cd\u09b0\u0997\u09a4\u09bf \u098f\u0995 \u09a8\u099c\u09b0\u09c7", "A quick view of your learning progress.")}</p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="rounded-2xl">
                <CardContent className="space-y-2 p-6">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            stats.map((stat, index) => (
              <Card key={index} className="overflow-hidden rounded-2xl border-none bg-card shadow-sm">
                <CardContent className="p-5">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <h2 className="text-xl font-bold">{t("\u09b8\u09be\u09ae\u09cd\u09aa\u09cd\u09b0\u09a4\u09bf\u0995 \u0995\u09be\u09b0\u09cd\u09af\u0995\u09b2\u09be\u09aa", "Recent Activity")}</h2>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : summary?.recentActivity?.length ? (
                  <div className="divide-y border-border">
                    {summary.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/30 sm:p-6">
                        <div className="mt-1 shrink-0 rounded-full bg-primary/10 p-2">
                          {activity.type === "lesson_completed" ? <CheckCircle2 className="h-4 w-4 text-primary" /> : activity.type === "quiz_taken" ? <BookOpen className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium sm:text-base">{t(activity.titleBn, activity.titleEn)}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
                            {activity.points && <span className="text-xs font-bold text-amber-500">+{activity.points} pts</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">{t("\u0995\u09cb\u09a8\u09cb \u0995\u09be\u09b0\u09cd\u09af\u0995\u09b2\u09be\u09aa \u09a8\u09c7\u0987", "No activity yet")}</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-none bg-gradient-to-br from-primary to-indigo-900 text-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="text-orange-400" />
                  {t("\u09a6\u09c8\u09a8\u09bf\u0995 \u099f\u09be\u09b0\u09cd\u0997\u09c7\u099f", "Daily Goal")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{t("\u0986\u099c\u0995\u09c7\u09b0 \u0985\u0997\u09cd\u09b0\u0997\u09a4\u09bf", "Today's progress")}</span>
                      <span className="font-bold">60%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/20">
                      <div className="h-2 rounded-full bg-orange-400" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-white/80">{t("\u0986\u09b0 \u09e8\u099f\u09bf \u09aa\u09be\u09a0 \u09b6\u09c7\u09b7 \u0995\u09b0\u09b2\u09c7 \u0986\u099c\u0995\u09c7\u09b0 \u099f\u09be\u09b0\u09cd\u0997\u09c7\u099f \u09aa\u09c2\u09b0\u09a3 \u09b9\u09ac\u09c7", "Complete 2 more lessons to hit today's goal.")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
