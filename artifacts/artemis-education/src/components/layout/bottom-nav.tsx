import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/courses", label: "কোর্স", icon: BookOpen },
  { href: "/live", label: "লাইভ", icon: Video },
  { href: "/profile", label: "প্রোফাইল", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 px-6 py-2 pb-safe">
      <ul className="flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
