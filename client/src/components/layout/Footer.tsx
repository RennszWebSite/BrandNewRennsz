import { FaTwitch, FaYoutube, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

export default function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary py-10 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="text-primary font-montserrat font-bold text-3xl mb-2">
              RENNSZ
            </div>
            <p className="text-muted-foreground max-w-md">
              Gaming content creator and streamer. Join the community for epic gameplay and unforgettable moments!
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div>
              <h3 className="font-montserrat font-bold mb-3">Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#schedule" className="hover:text-primary transition-colors">Schedule</a></li>
                <li><a href="#videos" className="hover:text-primary transition-colors">Videos</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold mb-3">Social</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href={`https://twitch.tv/${settings?.twitchUsername || 'Rennsz'}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Twitch
                  </a>
                </li>
                {settings?.social?.youtube && (
                  <li>
                    <a 
                      href={settings.social.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      YouTube
                    </a>
                  </li>
                )}
                {settings?.social?.twitter && (
                  <li>
                    <a 
                      href={settings.social.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                )}
                {settings?.social?.instagram && (
                  <li>
                    <a 
                      href={settings.social.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                )}
                {settings?.social?.discord && (
                  <li>
                    <a 
                      href={settings.social.discord} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      Discord
                    </a>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="font-montserrat font-bold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {currentYear} Rennsz. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4">
            <a 
              href={`https://twitch.tv/${settings?.twitchUsername || 'Rennsz'}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitch />
            </a>
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <FaDiscord />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
