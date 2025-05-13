import { useState } from "react";
import { BellRing, ArrowRightIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function Announcements() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  
  const { data: announcements, error, isLoading } = useQuery({
    queryKey: ['/api/announcements', { limit: 3 }],
  });

  const getBadgeVariant = (type: string) => {
    switch (type.toUpperCase()) {
      case 'NEW':
        return {
          variant: 'default' as const,
          className: 'bg-primary/20 text-primary hover:bg-primary/30'
        };
      case 'IMPORTANT':
        return {
          variant: 'outline' as const,
          className: 'bg-muted/40 text-foreground hover:bg-muted/60'
        };
      case 'EVENT':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
        };
      default:
        return {
          variant: 'secondary' as const,
          className: ''
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load announcements" />;

  return (
    <section className="py-12 bg-gradient-to-b from-secondary/95 to-secondary/90">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-8">
          <BellRing className="inline-block text-primary mr-2" /> Latest Announcements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements?.map((announcement: any, index: number) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="card-hover bg-muted/20 border-border overflow-hidden shadow-lg">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-primary">{announcement.title}</h3>
                    <Badge
                      variant={getBadgeVariant(announcement.type).variant}
                      className={getBadgeVariant(announcement.type).className}
                    >
                      {announcement.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">{announcement.content}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(announcement.createdAt)}
                    </span>
                    <Button 
                      variant="link" 
                      className="text-primary hover:text-accent p-0"
                      onClick={() => setSelectedAnnouncement(announcement)}
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline">
            View All Announcements <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Announcement Details Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              {selectedAnnouncement?.title}
            </DialogTitle>
            <div className="mt-2">
              {selectedAnnouncement && (
                <Badge
                  variant={getBadgeVariant(selectedAnnouncement.type).variant}
                  className={getBadgeVariant(selectedAnnouncement.type).className}
                >
                  {selectedAnnouncement.type}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground ml-2">
                {selectedAnnouncement && formatDate(selectedAnnouncement.createdAt)}
              </span>
            </div>
          </DialogHeader>
          <DialogDescription className="text-base text-foreground">
            {selectedAnnouncement?.content}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </section>
  );
}
