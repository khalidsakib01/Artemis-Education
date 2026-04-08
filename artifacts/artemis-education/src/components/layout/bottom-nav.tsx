import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useAppAuth } from "@/contexts/AuthContext";

export function BottomNav() {
  const [location] = useLocation();
  const { t, lang, toggleLang } = useLang();
  const { isSignedIn } = useAppAuth();

  const navItems = [
    { href: isSignedIn ? "/home" : "/", label: t("\u09b9\u09cb\u09ae", "Home"), icon: Home },
    { href: "/courses", label: t("\u0995\u09cb\u09b0\u09cd\u09b8", "Courses"), icon: BookOpen },
    { href: "/live", label: t("\u09b2\u09be\u0987\u09ad", "Live"), icon: Video },
    { href: isSignedIn ? "/profile" : "/sign-in", label: t("\u09aa\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09b2", "Profile"), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-2 py-1 backdrop-blur md:hidden">
      <ul className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            location === item.href ||
            (item.href !== "/" && item.href !== "/sign-in" && location.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            onClick={toggleLang}
            className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Languages className="h-5 w-5" />
            <span className="text-[10px] font-medium">{lang === "bn" ? "EN" : "\u09ac\u09be\u0982\u09b2\u09be"}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
