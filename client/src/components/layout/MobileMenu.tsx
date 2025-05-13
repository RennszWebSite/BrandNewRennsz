import { Link } from "wouter";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";
import { User, LogOut } from "lucide-react";

interface SocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  socialLinks?: SocialLinks;
  twitchUsername?: string;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  socialLinks,
  twitchUsername = "Rennsz",
  isAuthenticated,
  onLoginClick,
  onLogout,
}: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="top" className="h-full pt-16 bg-secondary/95 backdrop-blur-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl text-primary font-montserrat">RENNSZ</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col space-y-3">
          <SheetClose asChild>
            <a href="#home" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
              Home
            </a>
          </SheetClose>
          
          <SheetClose asChild>
            <a href="#schedule" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
              Schedule
            </a>
          </SheetClose>
          
          <SheetClose asChild>
            <a href="#videos" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
              Videos
            </a>
          </SheetClose>
          
          <SheetClose asChild>
            <a href="#about" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
              About
            </a>
          </SheetClose>
          
          <SheetClose asChild>
            <a href="#contact" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
              Contact
            </a>
          </SheetClose>

          {isAuthenticated && (
            <SheetClose asChild>
              <Link href="/admin" className="py-2 px-4 rounded hover:bg-muted active:bg-muted/50 transition-colors">
                Admin Dashboard
              </Link>
            </SheetClose>
          )}
        </div>
        
        <div className="flex justify-center space-x-6 py-6 mt-4">
          <a 
            href={`https://twitch.tv/${twitchUsername}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <FaTwitch className="text-xl" />
          </a>
          
          {socialLinks?.youtube && (
            <a 
              href={socialLinks.youtube} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaYoutube className="text-xl" />
            </a>
          )}
          
          {socialLinks?.twitter && (
            <a 
              href={socialLinks.twitter} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
          )}
          
          {socialLinks?.instagram && (
            <a 
              href={socialLinks.instagram} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram className="text-xl" />
            </a>
          )}
          
          {socialLinks?.discord && (
            <a 
              href={socialLinks.discord} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaDiscord className="text-xl" />
            </a>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={onLoginClick}
              className="w-full"
            >
              <User className="mr-2 h-4 w-4" /> Admin Login
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
