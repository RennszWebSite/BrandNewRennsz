
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { FaTwitch, FaYoutube, FaTwitter, FaInstagram, FaDiscord } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function Socials() {
  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ['/api/social-links'],
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return <FaYoutube className="h-8 w-8" />;
      case 'twitter': case 'x': return <FaTwitter className="h-8 w-8" />;
      case 'instagram': return <FaInstagram className="h-8 w-8" />;
      case 'twitch': return <FaTwitch className="h-8 w-8" />;
      case 'discord': return <FaDiscord className="h-8 w-8" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return 'from-red-500 to-red-600';
      case 'twitter': case 'x': return 'from-blue-400 to-blue-500';
      case 'instagram': return 'from-purple-500 to-pink-500';
      case 'twitch': return 'from-purple-600 to-purple-700';
      case 'discord': return 'from-indigo-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <section id="socials" className="py-16 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect With Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialLinks?.map((link: any) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transform transition-all duration-300 hover:-translate-y-2"
              >
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br dark:bg-opacity-10 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getPlatformColor(link.platform)} opacity-10`}></div>
                    <div className="relative flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getPlatformColor(link.platform)}`}>
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{link.platform}</h3>
                        <p className="text-muted-foreground">{link.displayName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
