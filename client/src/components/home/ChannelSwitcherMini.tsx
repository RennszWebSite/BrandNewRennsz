import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { SiTwitch } from 'react-icons/si';

export default function ChannelSwitcherMini() {
  const queryClient = useQueryClient();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ['/api/settings'],
  });
  
  // Set initial channel when settings load
  if (settings && settings.currentChannel && !selectedChannel) {
    setSelectedChannel(settings.currentChannel);
  }
  
  const handleChannelChange = (channel: string) => {
    setSelectedChannel(channel);
    
    // This is view-only, the actual switching happens in the admin panel
    // But we immediately update the local state for a responsive UI
    queryClient.setQueryData(['/api/settings'], (oldData: any) => {
      return {
        ...oldData,
        currentChannel: channel,
      };
    });
  };
  
  if (isLoading) {
    return (
      <Card className="border-none bg-black/40 backdrop-blur-sm">
        <CardContent className="flex justify-center items-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  const mainChannel = settings?.twitchUsername || 'Rennsz';
  const altChannel = settings?.twitchAltUsername || 'Rennszino';
  const currentChannel = settings?.currentChannel || mainChannel;
  
  return (
    <Card className="border-none bg-black/40 backdrop-blur-sm">
      <CardContent className="p-3">
        <RadioGroup 
          value={currentChannel}
          onValueChange={handleChannelChange}
          className="flex gap-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem 
              value={mainChannel} 
              id="channel-switcher-main"
              className="text-primary"
            />
            <Label 
              htmlFor="channel-switcher-main" 
              className="cursor-pointer flex items-center text-sm"
            >
              <SiTwitch className="h-3 w-3 mr-1 text-[#9146FF]" />
              {mainChannel}
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem 
              value={altChannel} 
              id="channel-switcher-alt"
              className="text-primary"
            />
            <Label 
              htmlFor="channel-switcher-alt" 
              className="cursor-pointer flex items-center text-sm"
            >
              <SiTwitch className="h-3 w-3 mr-1 text-[#9146FF]" />
              {altChannel}
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}