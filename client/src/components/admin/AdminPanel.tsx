import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  BellRing,
  Calendar,
  Video,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminPanelProps {
  children: ReactNode;
  title: string;
}

export default function AdminPanel({ children, title }: AdminPanelProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Announcements",
      icon: <BellRing className="h-5 w-5" />,
      href: "/admin/announcements",
    },
    {
      title: "Schedule",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/schedule",
    },
    {
      title: "Videos",
      icon: <Video className="h-5 w-5" />,
      href: "/admin/videos",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ];

  return (
    <div className="flex min-h-screen bg-muted/10">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-sidebar">
        <div className="flex h-14 items-center px-4 py-4 border-b border-sidebar-border">
          <Link href="/">
            <a className="flex items-center">
              <span className="text-primary font-montserrat font-bold text-xl">RENNSZ</span>
              <span className="ml-2 text-xs bg-accent/20 rounded px-1.5 py-0.5 text-accent">
                ADMIN
              </span>
            </a>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`
                  flex items-center px-3 py-2 rounded-md text-sm font-medium 
                  ${location === item.href 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/10'
                  }
                  transition-colors
                `}>
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </a>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        
        <div className="px-4 py-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center justify-between px-6">
          <h1 className="text-xl font-montserrat font-bold">{title}</h1>
          
          {/* Mobile menu */}
          <div className="md:hidden flex items-center space-x-4">
            <Link href="/">
              <a className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Go to website</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </a>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
