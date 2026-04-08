import { Layout } from "@/components/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLang } from "@/contexts/LanguageContext";
import { getGetLeaderboardQueryKey, useGetLeaderboard } from "@workspace/api-client-react";
import { Flame, Medal, Trophy } from "lucide-react";

export default function Leaderboard() {
  const { t } = useLang();
  const { data: leaderboard, isLoading } = useGetLeaderboard({
    query: { queryKey: getGetLeaderboardQueryKey() },
  });

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
        <header className="space-y-2 py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary">{t("\u09b2\u09bf\u09a1\u09be\u09b0\u09ac\u09cb\u09b0\u09cd\u09a1", "Leaderboard")}</h1>
          <p className="text-sm text-muted-foreground">{t("\u09b8\u09c7\u09b0\u09be \u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0\u09a6\u09c7\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be\u09df \u09a8\u09bf\u099c\u09c7\u0995\u09c7 \u09a6\u09c7\u0996\u09c1\u09a8", "See where you stand among the top learners.")}</p>
        </header>

        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-xs font-semibold uppercase text-muted-foreground">
            <div className="col-span-2 text-center">{t("\u09b0\u200d\u09cd\u09af\u09be\u0982\u0995", "Rank")}</div>
            <div className="col-span-6">{t("\u09b6\u09bf\u0995\u09cd\u09b7\u09be\u09b0\u09cd\u09a5\u09c0", "Student")}</div>
            <div className="col-span-4 text-right">{t("\u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f", "Points")}</div>
          </div>

          <div className="divide-y">
            {isLoading ? (
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="grid grid-cols-12 items-center gap-4 p-4">
                    <div className="col-span-2 flex justify-center"><Skeleton className="h-8 w-8 rounded-full" /></div>
                    <div className="col-span-6 flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div></div>
                    <div className="col-span-4 flex justify-end"><Skeleton className="h-6 w-16" /></div>
                  </div>
                ))
            ) : leaderboard?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">{t("\u0995\u09cb\u09a8\u09cb \u09a4\u09a5\u09cd\u09af \u09a8\u09c7\u0987", "No data available")}</div>
            ) : (
              leaderboard?.map((user, index) => {
                const isTop3 = index < 3;
                return (
                  <div key={user.userId} className={`grid grid-cols-12 items-center gap-4 p-4 transition-colors hover:bg-muted/30 ${user.rank === 1 ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}>
                    <div className="col-span-2 flex justify-center font-bold">
                      {user.rank === 1 ? <Medal className="h-6 w-6 text-yellow-500" /> : user.rank === 2 ? <Medal className="h-6 w-6 text-gray-400" /> : user.rank === 3 ? <Medal className="h-6 w-6 text-amber-700" /> : <span className="text-muted-foreground">#{user.rank}</span>}
                    </div>

                    <div className="col-span-6 flex items-center gap-3">
                      <Avatar className={`h-10 w-10 border-2 ${isTop3 ? "border-primary" : "border-transparent"}`}>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.userName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold leading-tight">{user.userName}</p>
                        {user.streak > 0 && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-orange-500">
                            <Flame className="h-3 w-3 fill-current" />
                            {user.streak} {t("\u09a6\u09bf\u09a8", "days")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-4 flex justify-end">
                      <div className="font-bold text-primary">{user.totalPoints} <span className="text-xs font-normal text-muted-foreground">pts</span></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
