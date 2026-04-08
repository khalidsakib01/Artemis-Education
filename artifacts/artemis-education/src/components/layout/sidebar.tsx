import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User, LayoutDashboard, Trophy, LogOut, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useAppAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  const [location] = useLocation();
  const { signOut, user, isSignedIn, isAuthEnabled } = useAppAuth();
  const { lang, toggleLang, t } = useLang();

  const navItems = [
    { href: "/home", label: t("\u09b9\u09cb\u09ae", "Home"), icon: Home },
    { href: "/dashboard", label: t("\u09a1\u09cd\u09af\u09be\u09b6\u09ac\u09cb\u09b0\u09cd\u09a1", "Dashboard"), icon: LayoutDashboard },
    { href: "/courses", label: t("\u0995\u09cb\u09b0\u09cd\u09b8", "Courses"), icon: BookOpen },
    { href: "/live", label: t("\u09b2\u09be\u0987\u09ad \u0995\u09cd\u09b2\u09be\u09b8", "Live Classes"), icon: Video },
    { href: "/leaderboard", label: t("\u09b2\u09bf\u09a1\u09be\u09b0\u09ac\u09cb\u09b0\u09cd\u09a1", "Leaderboard"), icon: Trophy },
    { href: "/profile", label: t("\u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2", "Profile"), icon: User },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-border bg-card md:flex">
      <div className="p-6">
        <Link href={isSignedIn ? "/home" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-indigo-600 shadow">
            <span className="text-xl font-bold text-white">A</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-primary">Artemis</h1>
            <p className="text-[10px] leading-tight text-muted-foreground">Education platform</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
                isActive
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <button
          onClick={toggleLang}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/50 hover:text-foreground"
        >
          <Languages className="h-4 w-4" />
          <span>{lang === "bn" ? "Switch to English" : "\u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc \u09af\u09be\u09a8"}</span>
        </button>

        {isSignedIn && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={user?.imageUrl ?? undefined} />
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {user?.firstName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.firstName || user?.email || "Student"}</p>
            </div>
            <button
              onClick={() => void signOut()}
              className="text-muted-foreground transition-colors hover:text-destructive"
              title={t("\u09b8\u09be\u0987\u09a8 \u0986\u0989\u099f", "Sign out")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {!isAuthEnabled && (
          <p className="px-4 text-xs leading-relaxed text-muted-foreground">
            {t(
              "\u098f\u0987 \u09ad\u09be\u09b0\u09cd\u09b8\u09a8\u09c7 \u0985\u09a5\u09c7\u09a8\u099f\u09bf\u0995\u09c7\u09b6\u09a8 \u099a\u09be\u09b2\u09c1 \u09a8\u09c7\u0987\u0964 \u09a1\u09c7\u09ae\u09cb \u0995\u09a8\u09cd\u099f\u09c7\u09a8\u09cd\u099f \u09a6\u09bf\u09af\u09bc\u09c7 \u0986\u09aa\u09a8\u09bf \u098f\u0996\u09a8\u0993 \u09aa\u09c7\u099c\u0997\u09c1\u09b2\u09cb \u09a6\u09c7\u0996\u09a4\u09c7 \u09aa\u09be\u09b0\u09ac\u09c7\u09a8\u0964",
              "Authentication is not configured in this environment. Demo content is available so you can still browse the app.",
            )}
          </p>
        )}
      </div>
    </aside>
  );
}
