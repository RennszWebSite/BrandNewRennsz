import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import AdminPanel from "@/components/admin/AdminPanel";
import VideoEditor from "@/components/admin/VideoEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, MoreVertical, Pencil, Trash2, Search } from "lucide-react";
import { formatDateRelative, formatViews } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminVideos() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const { data: videos, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/videos'],
  });

  const handleNewVideo = () => {
    setSelectedVideo(null);
    setIsEditorOpen(true);
  };

  const handleEditVideo = (video: any) => {
    setSelectedVideo(video);
    setIsEditorOpen(true);
  };

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    setSelectedVideo(null);
    refetch();
    
    toast({
      title: "Success",
      description: selectedVideo 
        ? "Video updated successfully" 
        : "Video added successfully",
    });
  };

  const handleEditorCancel = () => {
    setIsEditorOpen(false);
    setSelectedVideo(null);
  };

  const handleDeleteVideo = async (id: number) => {
    setIsDeleting(id);
    
    try {
      await apiRequest('DELETE', `/api/videos/${id}`);
      
      toast({
        title: "Video deleted",
        description: "The video has been removed",
      });
      
      // Refresh videos
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the video",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTogglePublished = async (video: any) => {
    try {
      await apiRequest('PUT', `/api/videos/${video.id}`, {
        published: !video.published
      });
      
      toast({
        title: video.published ? "Video hidden" : "Video published",
        description: `The video is now ${video.published ? 'hidden from' : 'visible on'} the website`,
      });
      
      // Refresh videos
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
    } catch (error) {
      console.error('Error updating video:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update the video status",
      });
    }
  };

  // Get unique video types for filter
  const videoTypes = videos 
    ? ['all', ...new Set(videos.map((video: any) => video.type))]
    : ['all'];

  const filteredVideos = videos?.filter((video: any) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || video.type === filterType;
    return matchesSearch && matchesType;
  });

  if (isLoading) return (
    <AdminPanel title="Videos">
      <LoadingState message="Loading videos..." />
    </AdminPanel>
  );

  if (error) return (
    <AdminPanel title="Videos">
      <ErrorState 
        message="Failed to load videos" 
        retryFn={refetch}
      />
    </AdminPanel>
  );

  return (
    <AdminPanel title="Videos">
      {isEditorOpen ? (
        <VideoEditor 
          video={selectedVideo}
          onSuccess={handleEditorSuccess}
          onCancel={handleEditorCancel}
        />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {videoTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleNewVideo}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manage Videos</CardTitle>
              <CardDescription>
                Add and manage videos to display on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVideos?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thumbnail</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video: any) => (
                      <TableRow key={video.id}>
                        <TableCell>
                          <div className="w-16 h-10 rounded overflow-hidden">
                            <img 
                              src={video.thumbnailUrl} 
                              alt={video.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">
                          {video.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {video.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatViews(video.views)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={video.published}
                            onCheckedChange={() => handleTogglePublished(video)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditVideo(video)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteVideo(video.id)}
                                disabled={isDeleting === video.id}
                              >
                                {isDeleting === video.id ? (
                                  <>
                                    <span className="mr-2 h-4 w-4 animate-spin">◌</span> Deleting...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterType !== 'all' 
                      ? 'No videos match your search criteria' 
                      : 'No videos added yet'}
                  </p>
                  {!searchQuery && filterType === 'all' && (
                    <Button onClick={handleNewVideo}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add your first video
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminPanel>
  );
}
