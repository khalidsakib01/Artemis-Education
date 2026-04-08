import { Link, useLocation } from "wouter";
import { Home, BookOpen, Video, User, LayoutDashboard, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/dashboard", label: "আমার ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/courses", label: "কোর্সসমূহ", icon: BookOpen },
  { href: "/live", label: "লাইভ ক্লাস", icon: Video },
  { href: "/leaderboard", label: "লিডারবোর্ড", icon: Trophy },
  { href: "/profile", label: "প্রোফাইল", icon: User },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-card border-r border-border">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-primary">Artemis</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">Education</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
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
      
      <div className="p-6 border-t border-border">
         <div className="text-xs text-muted-foreground text-center">
           "স্মার্টভাবে শিখুন, সফলতা অর্জন করুন"
         </div>
      </div>
    </aside>
  );
}
