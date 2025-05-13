import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import MobileMenu from "./MobileMenu";
import {
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaDiscord,
  FaBars,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import AdminLogin from "@/components/admin/AdminLogin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserCog } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });
  
  const isLive = settings?.streamStatus === 'online';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur-md ${isScrolled ? 'bg-secondary/90' : 'bg-secondary/70'} border-b border-border`}>
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-primary font-montserrat font-bold text-2xl">
                RENNSZ
              </a>
            </Link>
            {isLive && (
              <div className="ml-4 px-2 py-1 bg-green-500/20 rounded text-xs font-medium hidden sm:flex items-center text-green-500 live-indicator">
                LIVE
              </div>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="nav-link active font-medium hover:text-primary transition-colors">Home</a>
            <a href="#schedule" className="nav-link font-medium hover:text-primary transition-colors">Schedule</a>
            <a href="#videos" className="nav-link font-medium hover:text-primary transition-colors">Videos</a>
            <a href="#about" className="nav-link font-medium hover:text-primary transition-colors">About</a>
            <a href="#contact" className="nav-link font-medium hover:text-primary transition-colors">Contact</a>
          </div>
          
          {/* Social Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href={`https://twitch.tv/${settings?.twitchUsername || 'Rennsz'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitch className="text-xl" />
            </a>
            {settings?.social?.youtube && (
              <a 
                href={settings.social.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaYoutube className="text-xl" />
              </a>
            )}
            {settings?.social?.twitter && (
              <a 
                href={settings.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
            )}
            {settings?.social?.instagram && (
              <a 
                href={settings.social.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
            )}
            {settings?.social?.discord && (
              <a 
                href={settings.social.discord} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaDiscord className="text-xl" />
              </a>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCog className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <a className="cursor-pointer w-full">Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLoginModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars className="text-xl" />
          </Button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        socialLinks={settings?.social}
        twitchUsername={settings?.twitchUsername}
        isAuthenticated={isAuthenticated}
        onLoginClick={() => {
          setMobileMenuOpen(false);
          setLoginModalOpen(true);
        }}
        onLogout={() => {
          setMobileMenuOpen(false);
          logout();
        }}
      />

      {/* Admin Login Modal */}
      <AdminLogin 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}
