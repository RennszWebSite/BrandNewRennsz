import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BellRing,
  Calendar,
  ChevronRight,
  Edit,
  Info,
  PlusCircle,
  Radio,
  Users,
  Video,
} from "lucide-react";
import { formatDateRelative } from "@/lib/utils";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

export default function AdminDashboard() {
  const [_, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  // Fetch recent data
  const { data: announcements, isLoading: announcementsLoading, error: announcementsError } = useQuery({
    queryKey: ['/api/announcements', { limit: 3 }],
  });
  
  const { data: scheduleItems, isLoading: scheduleLoading, error: scheduleError } = useQuery({
    queryKey: ['/api/schedule'],
  });
  
  const { data: videos, isLoading: videosLoading, error: videosError } = useQuery({
    queryKey: ['/api/videos', { limit: 3 }],
  });
  
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useQuery({
    queryKey: ['/api/settings'],
  });

  const isLoading = announcementsLoading || scheduleLoading || videosLoading || settingsLoading;
  const hasError = announcementsError || scheduleError || videosError || settingsError;

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (isLoading) return (
    <AdminPanel title="Dashboard">
      <LoadingState message="Loading dashboard data..." />
    </AdminPanel>
  );

  if (hasError) return (
    <AdminPanel title="Dashboard">
      <ErrorState message="Failed to load dashboard data" />
    </AdminPanel>
  );

  return (
    <AdminPanel title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stream Status</CardTitle>
            <Radio className={settings?.streamStatus === 'online' ? 'text-green-500' : 'text-muted-foreground'} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings?.streamStatus === 'online' ? (
                <span className="text-green-500">LIVE</span>
              ) : (
                <span>Offline</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {settings?.streamStatus === 'online' 
                ? `${settings?.viewerCount || '0'} current viewers` 
                : 'Not currently streaming'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Announcements</CardTitle>
            <BellRing className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {announcements && announcements.length > 0 
                ? `Last updated ${formatDateRelative(announcements[0].createdAt)}`
                : 'No announcements'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Schedule Items</CardTitle>
            <Calendar className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduleItems?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {scheduleItems && scheduleItems.length > 0 
                ? `Across ${new Set(scheduleItems.map((item: any) => item.dayOfWeek)).size} days`
                : 'No schedule items'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{videos?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {videos && videos.length > 0 
                ? `${new Set(videos.map((video: any) => video.type)).size} categories`
                : 'No videos'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Announcements</CardTitle>
            <Link href="/admin/announcements">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <a>
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div key={announcement.id} className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium leading-none">{announcement.title}</p>
                        <Badge 
                          variant="outline" 
                          className="ml-2 text-[10px]"
                        >
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateRelative(announcement.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground mb-4">No announcements yet</p>
                <Link href="/admin/announcements">
                  <Button asChild>
                    <a>
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Announcement
                    </a>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Schedule</CardTitle>
            <Link href="/admin/schedule">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <a>
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {scheduleItems && scheduleItems.length > 0 ? (
              <div className="space-y-4">
                {scheduleItems.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {dayNames[item.dayOfWeek]} • {item.startTime} - {item.endTime} {item.timeZone}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground mb-4">No schedule items yet</p>
                <Link href="/admin/schedule">
                  <Button asChild>
                    <a>
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Schedule
                    </a>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Videos</CardTitle>
            <Link href="/admin/videos">
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <a>
                  View All <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {videos && videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video: any) => (
                  <div key={video.id} className="flex items-start space-x-4">
                    <div className="rounded-md overflow-hidden flex-shrink-0 w-12 h-8">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none line-clamp-1">{video.title}</p>
                      <div className="flex text-xs text-muted-foreground">
                        <span>{video.type}</span>
                        <span className="mx-1">•</span>
                        <span>{video.views} views</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-muted-foreground mb-4">No videos yet</p>
                <Link href="/admin/videos">
                  <Button asChild>
                    <a>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Video
                    </a>
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPanel>
  );
}
