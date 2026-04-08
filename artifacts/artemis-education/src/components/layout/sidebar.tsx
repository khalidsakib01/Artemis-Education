import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User, LayoutDashboard, Trophy, LogOut, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClerk, useUser } from "@clerk/react";
import { useLang } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const { lang, toggleLang, t } = useLang();

  const navItems = [
    { href: "/home", label: t("হোম", "Home"), icon: Home },
    { href: "/dashboard", label: t("আমার ড্যাশবোর্ড", "Dashboard"), icon: LayoutDashboard },
    { href: "/courses", label: t("কোর্সসমূহ", "Courses"), icon: BookOpen },
    { href: "/live", label: t("লাইভ ক্লাস", "Live Classes"), icon: Video },
    { href: "/leaderboard", label: t("লিডারবোর্ড", "Leaderboard"), icon: Trophy },
    { href: "/profile", label: t("প্রোফাইল", "Profile"), icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-card border-r border-border">
      <div className="p-6">
        <Link href={isSignedIn ? "/home" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-primary">Artemis</h1>
            <p className="text-[10px] text-muted-foreground leading-tight" style={{fontFamily:"'Hind Siliguri', sans-serif"}}>আর্টেমিস এডুকেশন</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all text-sm font-medium"
        >
          <Languages className="w-4 h-4" />
          <span>{lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}</span>
        </button>

        {/* User info + sign out */}
        {isSignedIn && (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.firstName?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}</p>
            </div>
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title={t("লগআউট", "Sign out")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
