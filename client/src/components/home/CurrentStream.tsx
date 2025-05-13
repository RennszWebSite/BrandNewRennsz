import { useState } from "react";
import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TwitchEmbed from "@/components/shared/TwitchEmbed";
import ChannelSwitcherMini from "@/components/home/ChannelSwitcherMini";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface CurrentStreamProps {
  twitchUsername?: string;
}

export default function CurrentStream({ twitchUsername = "Rennsz" }: CurrentStreamProps) {
  const [streamStatus, setStreamStatus] = useState<"loading" | "online" | "offline">("loading");
  const { toast } = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
  });

  const handleStreamOnline = () => {
    setStreamStatus("online");
    toast({
      title: "Stream is live!",
      description: "Rennsz is currently streaming. Enjoy the show!",
    });
  };

  const handleStreamOffline = () => {
    setStreamStatus("offline");
  };

  // Get current channel from settings
  const currentChannel = settings?.currentChannel || twitchUsername;

  return (
    <section className="py-10 bg-gradient-to-b from-secondary to-secondary/95">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-8/12">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center mb-2 md:mb-0">
                <h2 className="text-2xl sm:text-3xl font-montserrat font-bold">
                  <Radio className="inline-block text-primary mr-2" /> Current Stream
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <ChannelSwitcherMini />
                
                <div className="flex items-center space-x-2">
                  {streamStatus === "online" && (
                    <>
                      <span className="live-indicator text-green-500 text-sm font-medium">LIVE</span>
                      <span className="text-sm text-muted-foreground">Started 2h 15m ago</span>
                    </>
                  )}
                  {streamStatus === "offline" && (
                    <span className="text-sm text-muted-foreground">Offline</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg overflow-hidden shadow-xl relative aspect-video">
              <TwitchEmbed 
                channel={currentChannel} 
                onOnline={handleStreamOnline}
                onOffline={handleStreamOffline}
              />
            </div>
            
            <div className="mt-6 bg-muted/30 rounded-lg p-4">
              <h3 className="font-montserrat font-bold text-xl mb-2 text-primary">Friday Night Stream: Ranked Matches</h3>
              <p className="text-muted-foreground">Playing competitive matches with viewers! Drop a follow and join the fun. !commands for more info.</p>
              <div className="flex flex-wrap items-center mt-4 gap-2">
                <Badge variant="secondary">FPS</Badge>
                <Badge variant="secondary">Competitive</Badge>
                <Badge variant="secondary">Viewer Games</Badge>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-4/12">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <div className="bg-muted/40 p-4 border-b border-border">
                <h3 className="font-montserrat font-bold">Stream Chat</h3>
              </div>
              <div className="h-[500px] overflow-y-auto p-4">
                <div className="flex flex-col space-y-4">
                  {/* This is a placeholder for the chat, in reality we'd use Twitch chat API */}
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-medium">GG</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-accent">GameGuru</span>
                        <span className="text-xs text-muted-foreground">2m ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">That was an amazing play!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs font-medium">TS</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-primary">TwitchStar</span>
                        <span className="text-xs text-muted-foreground">5m ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Can we play together next round?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-xs font-medium">MP</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-500">Mod_Pro</span>
                        <span className="text-xs bg-blue-500/20 px-1 rounded">MOD</span>
                        <span className="text-xs text-muted-foreground">7m ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Remember to follow the chat rules everyone!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xs font-medium">NS</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-green-500">NewSub</span>
                        <span className="text-xs bg-green-500/20 px-1 rounded">NEW SUB</span>
                        <span className="text-xs text-muted-foreground">10m ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Just subscribed! Love your content!</p>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 border-t border-border">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Send a message..." 
                    className="w-full bg-muted/50 border border-muted/60 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    disabled 
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary opacity-50" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
                <p className="text-xs mt-2 text-muted-foreground text-center">Login to chat with the community</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
