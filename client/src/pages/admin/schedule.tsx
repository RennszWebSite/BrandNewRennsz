import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import AdminPanel from "@/components/admin/AdminPanel";
import ScheduleEditor from "@/components/admin/ScheduleEditor";
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
import { PlusCircle, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatStreamTime } from "@/lib/utils";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminSchedule() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any>(null);
  const [filterDay, setFilterDay] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const { data: scheduleItems, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/schedule'],
  });

  const handleNewScheduleItem = () => {
    setSelectedScheduleItem(null);
    setIsEditorOpen(true);
  };

  const handleEditScheduleItem = (scheduleItem: any) => {
    setSelectedScheduleItem(scheduleItem);
    setIsEditorOpen(true);
  };

  const handleEditorSuccess = () => {
    setIsEditorOpen(false);
    setSelectedScheduleItem(null);
    refetch();
    
    toast({
      title: "Success",
      description: selectedScheduleItem 
        ? "Schedule item updated successfully" 
        : "Schedule item created successfully",
    });
  };

  const handleEditorCancel = () => {
    setIsEditorOpen(false);
    setSelectedScheduleItem(null);
  };

  const handleDeleteScheduleItem = async (id: number) => {
    setIsDeleting(id);
    
    try {
      await apiRequest('DELETE', `/api/schedule/${id}`);
      
      toast({
        title: "Schedule item deleted",
        description: "The schedule item has been removed",
      });
      
      // Refresh schedule items
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
    } catch (error) {
      console.error('Error deleting schedule item:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "Failed to delete the schedule item",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const filteredScheduleItems = scheduleItems?.filter((item: any) => 
    filterDay === 'all' || item.dayOfWeek.toString() === filterDay
  );

  if (isLoading) return (
    <AdminPanel title="Schedule">
      <LoadingState message="Loading schedule..." />
    </AdminPanel>
  );

  if (error) return (
    <AdminPanel title="Schedule">
      <ErrorState 
        message="Failed to load schedule" 
        retryFn={refetch}
      />
    </AdminPanel>
  );

  return (
    <AdminPanel title="Schedule">
      {isEditorOpen ? (
        <ScheduleEditor 
          scheduleItem={selectedScheduleItem}
          onSuccess={handleEditorSuccess}
          onCancel={handleEditorCancel}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Select
              value={filterDay}
              onValueChange={setFilterDay}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {dayNames.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleNewScheduleItem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Schedule Item
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stream Schedule</CardTitle>
              <CardDescription>
                Manage your streaming schedule to let viewers know when you'll be live
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredScheduleItems?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScheduleItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {dayNames[item.dayOfWeek]}
                        </TableCell>
                        <TableCell>
                          {formatStreamTime(item.startTime)} - {formatStreamTime(item.endTime)}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({item.timeZone})
                          </span>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
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
                                onClick={() => handleEditScheduleItem(item)}
                              >
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteScheduleItem(item.id)}
                                disabled={isDeleting === item.id}
                              >
                                {isDeleting === item.id ? (
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
                    {filterDay !== 'all' 
                      ? `No schedule items for ${dayNames[parseInt(filterDay)]}` 
                      : 'No schedule items yet'}
                  </p>
                  <Button onClick={handleNewScheduleItem}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create your first schedule item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </AdminPanel>
  );
}
