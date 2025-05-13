import { useState } from "react";
import { FilmIcon, PlayIcon, ArrowRightIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import { motion } from "framer-motion";

export default function Videos() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const { data: videos, error, isLoading } = useQuery({
    queryKey: ['/api/videos', { limit: 3 }],
  });

  const filteredVideos = selectedType
    ? videos?.filter((video: any) => video.type === selectedType)
    : videos;

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
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
  if (error) return <ErrorState message="Failed to load videos" />;

  return (
    <section id="videos" className="py-12 bg-gradient-to-b from-secondary/85 to-secondary/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-4 sm:mb-0">
            <FilmIcon className="inline-block text-primary mr-2" /> Latest Videos
          </h2>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={selectedType === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedType(null)}
            >
              All
            </Button>
            <Button 
              variant={selectedType === "Highlights" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedType("Highlights")}
            >
              Highlights
            </Button>
            <Button 
              variant={selectedType === "Full Streams" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedType("Full Streams")}
            >
              Full Streams
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {false && filteredVideos?.map((video: any, index: number) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="card-hover bg-muted/20 border-border overflow-hidden shadow-lg">
                <div className="relative aspect-video">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                    <Button 
                      size="icon" 
                      className="w-12 h-12 rounded-full bg-primary/80 hover:bg-primary transition-colors"
                      asChild
                    >
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                        <PlayIcon className="h-6 w-6" />
                      </a>
                    </Button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {formatViews(video.views)} views • {formatDate(video.createdAt)}
                    </span>
                    <Button 
                      variant="link" 
                      className="text-primary hover:text-accent p-0"
                      asChild
                    >
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                        Watch
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline">
            View All Videos <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
