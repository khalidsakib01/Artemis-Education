import { Layout } from "@/components/layout";
import { useGetLeaderboard, getGetLeaderboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Medal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard({
    query: { queryKey: getGetLeaderboardQueryKey() }
  });

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-2 py-6">
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-primary">লিডারবোর্ড</h1>
          <p className="text-muted-foreground text-sm">সেরা শিক্ষার্থীদের তালিকায় নিজেকে দেখুন</p>
        </header>

        <div className="bg-card rounded-2xl shadow-sm border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
            <div className="col-span-2 text-center">র‍্যাংক</div>
            <div className="col-span-6">শিক্ষার্থী</div>
            <div className="col-span-4 text-right">পয়েন্ট</div>
          </div>
          
          <div className="divide-y">
            {isLoading ? (
              Array(10).fill(0).map((_, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-2 flex justify-center"><Skeleton className="w-8 h-8 rounded-full" /></div>
                  <div className="col-span-6 flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-end"><Skeleton className="h-6 w-16" /></div>
                </div>
              ))
            ) : leaderboard?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">কোনো তথ্য নেই</div>
            ) : (
              leaderboard?.map((user, index) => {
                const isTop3 = index < 3;
                return (
                  <div 
                    key={user.userId} 
                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-muted/30 ${
                      user.rank === 1 ? "bg-amber-50/50 dark:bg-amber-900/10" : ""
                    }`}
                  >
                    <div className="col-span-2 flex justify-center font-bold">
                      {user.rank === 1 ? <Medal className="w-6 h-6 text-yellow-500" /> :
                       user.rank === 2 ? <Medal className="w-6 h-6 text-gray-400" /> :
                       user.rank === 3 ? <Medal className="w-6 h-6 text-amber-700" /> :
                       <span className="text-muted-foreground">#{user.rank}</span>}
                    </div>
                    
                    <div className="col-span-6 flex items-center gap-3">
                      <Avatar className={`h-10 w-10 border-2 ${isTop3 ? 'border-primary' : 'border-transparent'}`}>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.userName.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm leading-tight">{user.userName}</p>
                        {user.streak > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-orange-500 font-medium mt-0.5">
                            <Flame className="w-3 h-3 fill-current" />
                            {user.streak} দিন
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
