import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function StreakDisplay() {
  const { data: summary, isLoading } = useGetDashboardSummary({
    query: {
      queryKey: getGetDashboardSummaryQueryKey()
    }
  });

  if (isLoading) {
    return <Skeleton className="h-8 w-20 rounded-full" />;
  }

  const streak = summary?.currentStreak || 0;
  const isActive = streak > 0;

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm transition-colors",
      isActive ? "bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-500" : "bg-muted text-muted-foreground"
    )}>
      <Flame className={cn("w-4 h-4", isActive && "fill-current animate-pulse")} />
      <span>{streak} দিন</span>
    </div>
  );
}
