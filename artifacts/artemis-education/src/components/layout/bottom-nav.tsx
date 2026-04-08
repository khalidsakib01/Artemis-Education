import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/react";

export function BottomNav() {
  const [location] = useLocation();
  const { t, lang, toggleLang } = useLang();
  const { isSignedIn } = useUser();

  const navItems = [
    { href: isSignedIn ? "/home" : "/", label: t("হোম", "Home"), icon: Home },
    { href: "/courses", label: t("কোর্স", "Courses"), icon: BookOpen },
    { href: "/live", label: t("লাইভ", "Live"), icon: Video },
    { href: isSignedIn ? "/profile" : "/sign-in", label: t("প্রোফাইল", "Profile"), icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border z-50 px-2 py-1">
      <ul className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && item.href !== "/sign-in" && location.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
        {/* Language Toggle */}
        <li>
          <button
            onClick={toggleLang}
            className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
          >
            <Languages className="w-5 h-5" />
            <span className="text-[10px] font-medium">{lang === "bn" ? "EN" : "বাং"}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
