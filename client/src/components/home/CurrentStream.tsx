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
  
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ['/api/settings'],
  });

  const handleStreamOnline = () => {
    setStreamStatus("online");
    toast({
      title: "Stream is live!",
      description: "The stream is now live. Enjoy the show!",
    });
  };

  const handleStreamOffline = () => {
    setStreamStatus("offline");
  };

  // Get current channel from settings
  const currentChannel = settings ? (settings.currentChannel || twitchUsername) : twitchUsername;

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
            
            <div className="bg-muted/40 rounded-lg overflow-hidden shadow-xl relative">
              <div className="w-full aspect-video min-h-[300px] sm:min-h-[400px]">
                <TwitchEmbed 
                  channel={currentChannel} 
                  onOnline={handleStreamOnline}
                  onOffline={handleStreamOffline}
                />
              </div>
            </div>
            
            <div className="mt-6 bg-muted/30 rounded-lg p-4">
              <h3 className="font-montserrat font-bold text-xl mb-2 text-primary">Live Stream Info</h3>
              <p className="text-muted-foreground">{streamStatus === "online" ? "Stream is currently live! Join the fun and interact with the community." : "Stream is currently offline. Check the schedule for upcoming streams!"}</p>
            </div>
          </div>
          
          <div className="w-full md:w-4/12 space-y-4">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <div className="bg-muted/40 p-4">
                <h3 className="font-montserrat font-bold mb-2">Channel Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Channel:</span>
                    <span className="text-sm font-medium">{currentChannel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`text-sm font-medium ${streamStatus === "online" ? "text-green-500" : "text-gray-400"}`}>
                      {streamStatus === "online" ? "Live" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <div className="bg-muted/40 p-4">
                <h3 className="font-montserrat font-bold mb-2">Channel Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Watch Live:</span>
                    <a 
                      href={`https://twitch.tv/${currentChannel}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Open in Twitch
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Follow:</span>
                    <a 
                      href={`https://twitch.tv/${currentChannel}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Follow Channel
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
