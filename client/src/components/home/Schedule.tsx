import { useState, useEffect } from "react";
import { CalendarIcon, BellIcon, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import { useToast } from "@/hooks/use-toast";

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [currentTime, setCurrentTime] = useState<string>('');
  const { toast } = useToast();
  
  const { data: allScheduleItems, error, isLoading } = useQuery({
    queryKey: ['/api/schedule'],
  });
  
  // Filter schedule items for the selected day
  const scheduleItems = allScheduleItems?.filter((item: any) => item.dayOfWeek === selectedDay);

  useEffect(() => {
    // Update current time
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    
    updateCurrentTime();
    const timer = setInterval(updateCurrentTime, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const handleRemindClick = (title: string, time: string) => {
    toast({
      title: "Reminder Set",
      description: `You'll be reminded before "${title}" at ${time}`,
    });
  };
  
  const formatTime = (time24h: string) => {
    const [hours, minutes] = time24h.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load schedule" />;

  return (
    <section id="schedule" className="py-12 bg-gradient-to-b from-secondary/90 to-secondary/85">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-8">
          <CalendarIcon className="inline-block text-primary mr-2" /> Stream Schedule
        </h2>
        
        <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 border-b border-border">
            {dayNames.map((day, index) => (
              <div 
                key={index}
                className={`p-4 text-center border-r border-border last:border-r-0 cursor-pointer hover:bg-muted/30 transition-colors ${selectedDay === index ? 'bg-muted/40' : ''}`}
                onClick={() => setSelectedDay(index)}
              >
                <h3 className="font-medium">{day}</h3>
              </div>
            ))}
          </div>
          
          <div className="p-6">
            {false && scheduleItems && scheduleItems.length > 0 ? (
              scheduleItems.map((item: any) => (
                <div key={item.id} className="schedule-item relative flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-border last:border-b-0 last:pb-0 first:pt-0">
                  <div className="mb-2 md:mb-0">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="block text-primary font-medium">
                        {formatTime(item.startTime)} - {formatTime(item.endTime)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.timeZone} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemindClick(item.title, formatTime(item.startTime))}
                    >
                      <BellIcon className="h-4 w-4 mr-1" /> Remind
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No streams scheduled for this day
              </div>
            )}
          </div>
          
          <div className="p-4 bg-muted/30 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              All times are shown in your local timezone. Current time: <span className="text-primary font-medium">{currentTime}</span>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
