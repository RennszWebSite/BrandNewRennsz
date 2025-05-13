import { UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaTwitch,
  FaYoutube,
  FaTwitter,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import rennsz from "@assets/IMG_2456.png";

interface SocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
}

interface AboutSectionProps {
  socialLinks?: SocialLinks;
}

export default function AboutSection({ socialLinks }: AboutSectionProps) {
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  return (
    <section id="about" className="py-12 bg-gradient-to-b from-secondary/80 to-secondary/75">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-8">
          <UserIcon className="inline-block text-primary mr-2" /> About Rennsz
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/50">
                    <img 
                      src={rennsz} 
                      alt="Rennsz profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <h3 className="text-2xl font-montserrat font-bold mb-2">Rennsz</h3>
                  <p className="text-muted-foreground text-center mb-4">Competitive FPS Player & Content Creator</p>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    <a 
                      href={`https://twitch.tv/${settings?.twitchUsername || 'Rennsz'}`} 
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
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-primary font-bold text-xl">42.5K</div>
                      <div className="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="text-primary font-bold text-xl">1.2M</div>
                      <div className="text-sm text-muted-foreground">Total Views</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-2/3">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-montserrat font-bold mb-4">My Story</h3>
                
                <div className="prose prose-invert max-w-none">
                  <p>
                    Hey everyone! I'm Rennsz, a passionate gamer and content creator dedicated to bringing you high-quality entertainment and competitive gameplay. I started streaming in 2020 and have been growing an amazing community of like-minded gamers ever since.
                  </p>
                  
                  <p>
                    My content focuses primarily on FPS games, where I combine competitive gameplay with entertaining commentary. Whether you're here to learn new strategies, enjoy some casual gaming, or just hang out with the community, there's something for everyone!
                  </p>
                  
                  <p>
                    When I'm not streaming, I'm usually practicing to improve my skills, creating content for YouTube, or connecting with my community on Discord. I believe in creating a positive, inclusive environment where everyone feels welcome.
                  </p>
                </div>
                
                <h3 className="text-xl font-montserrat font-bold mt-8 mb-4">Streaming Setup</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">PC Specs</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><span className="text-primary">CPU:</span> AMD Ryzen 9 5950X</li>
                      <li><span className="text-primary">GPU:</span> NVIDIA RTX 3090</li>
                      <li><span className="text-primary">RAM:</span> 32GB DDR4 3600MHz</li>
                      <li><span className="text-primary">Storage:</span> 2TB NVMe SSD</li>
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Peripherals</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><span className="text-primary">Monitor:</span> 27" 240Hz IPS</li>
                      <li><span className="text-primary">Keyboard:</span> Custom Mechanical</li>
                      <li><span className="text-primary">Mouse:</span> Logitech G Pro X</li>
                      <li><span className="text-primary">Microphone:</span> Shure SM7B</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
