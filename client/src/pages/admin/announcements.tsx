import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import AdminPanel from "@/components/admin/AdminPanel";
import AnnouncementEditor from "@/components/admin/AnnouncementEditor";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, MoreVertical, Pencil, Trash2, Search } from "lucide-react";
import { formatDateRelative } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminAnnouncements() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const { data: announcements, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const handleNewAnnouncement = () => {
    setSelectedAnnouncement(null);
    setIsEditorOpen(true);
  };

  const handleEditAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setIsEditorOpen(true);
  };

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    setSelectedAnnouncement(null);
    refetch();
    
    toast({
      title: "Success",
      description: selectedAnnouncement 
        ? "Announcement updated successfully" 
        : "Announcement created successfully",
    });
  };

  const handleEditorCancel = () => {
    setIsEditorOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    setIsDeleting(id);
    
    try {
      await apiRequest('DELETE', `/api/announcements/${id}`);
      
      toast({
        title: "Announcement deleted",
        description: "The announcement has been removed",
      });
      
      // Refresh announcements
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the announcement",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleTogglePublished = async (announcement: any) => {
    try {
      await apiRequest('PUT', `/api/announcements/${announcement.id}`, {
        published: !announcement.published
      });
      
      toast({
        title: announcement.published ? "Announcement hidden" : "Announcement published",
        description: `The announcement is now ${announcement.published ? 'hidden from' : 'visible on'} the website`,
      });
      
      // Refresh announcements
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update the announcement status",
      });
    }
  };

  const filteredAnnouncements = announcements?.filter((announcement: any) => 
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    announcement.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return (
    <AdminPanel title="Announcements">
      <LoadingState message="Loading announcements..." />
    </AdminPanel>
  );

  if (error) return (
    <AdminPanel title="Announcements">
      <ErrorState 
        message="Failed to load announcements" 
        retryFn={refetch}
      />
    </AdminPanel>
  );

  return (
    <AdminPanel title="Announcements">
      {isEditorOpen ? (
        <AnnouncementEditor 
          announcement={selectedAnnouncement}
          onSuccess={handleEditorSuccess}
          onCancel={handleEditorCancel}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleNewAnnouncement}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Announcement
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manage Announcements</CardTitle>
              <CardDescription>
                Create, edit, and manage announcements that appear on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAnnouncements?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnnouncements.map((announcement: any) => (
                      <TableRow key={announcement.id}>
                        <TableCell className="font-medium">{announcement.title}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              announcement.type === 'NEW' ? 'bg-primary/20 text-primary' :
                              announcement.type === 'IMPORTANT' ? 'bg-orange-500/20 text-orange-500' :
                              announcement.type === 'EVENT' ? 'bg-blue-500/20 text-blue-500' :
                              ''
                            }
                          >
                            {announcement.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDateRelative(announcement.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={announcement.published}
                            onCheckedChange={() => handleTogglePublished(announcement)}
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
                                onClick={() => handleEditAnnouncement(announcement)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                disabled={isDeleting === announcement.id}
                              >
                                {isDeleting === announcement.id ? (
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
                    {searchQuery ? 'No announcements match your search' : 'No announcements yet'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleNewAnnouncement}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Create your first announcement
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
