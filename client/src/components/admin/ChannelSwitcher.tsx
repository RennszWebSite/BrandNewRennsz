import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function ChannelSwitcher() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  // Fetch current settings
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/settings'],
  });
  
  // Set selected channel when settings load
  if (settings?.currentChannel && !selectedChannel) {
    setSelectedChannel(settings.currentChannel);
  }
  
  const handleSwitchChannel = async () => {
    if (!selectedChannel) return;
    
    try {
      setIsSubmitting(true);
      
      await apiRequest('PUT', '/api/settings/channel', { channel: selectedChannel });
      
      toast({
        title: 'Channel Updated',
        description: `Successfully switched to ${selectedChannel} channel`,
      });
      
      // Refresh settings
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    } catch (error) {
      console.error('Error switching channel:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to switch channel',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You must be logged in to manage channel settings.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel Switcher</CardTitle>
        <CardDescription>
          Switch between your IRL and gaming channels
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load channel settings. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <RadioGroup 
            value={selectedChannel || ''}
            onValueChange={setSelectedChannel}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={settings?.twitchUsername || 'Rennsz'} id="channel-main" />
              <Label htmlFor="channel-main" className="cursor-pointer">
                <div className="font-medium">{settings?.twitchUsername || 'Rennsz'}</div>
                <div className="text-sm text-muted-foreground">IRL Channel</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={settings?.twitchAltUsername || 'Rennszino'} id="channel-alt" />
              <Label htmlFor="channel-alt" className="cursor-pointer">
                <div className="font-medium">{settings?.twitchAltUsername || 'Rennszino'}</div>
                <div className="text-sm text-muted-foreground">Gaming and Chilling Channel</div>
              </Label>
            </div>
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSwitchChannel}
          disabled={isLoading || isSubmitting || !selectedChannel || selectedChannel === settings?.currentChannel}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Switching...
            </>
          ) : (
            'Switch Channel'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}