import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ContentEditor from "./ContentEditor";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the video form schema
const videoFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  thumbnailUrl: z.string().url({ message: "Valid thumbnail URL is required" }),
  videoUrl: z.string().url({ message: "Valid video URL is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  views: z.coerce.number().nonnegative({ message: "Views must be a positive number" }),
  published: z.boolean().default(true),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

interface VideoEditorProps {
  video?: {
    id: number;
    title: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    type: string;
    views: number;
    published: boolean;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VideoEditor({ 
  video, 
  onSuccess, 
  onCancel 
}: VideoEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isEditing = !!video;

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: video?.title || "",
      thumbnailUrl: video?.thumbnailUrl || "",
      videoUrl: video?.videoUrl || "",
      duration: video?.duration || "",
      type: video?.type || "",
      views: video?.views || 0,
      published: video?.published ?? true,
    },
  });

  const onSubmit = async (data: VideoFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing && video) {
        // Update existing video
        await apiRequest('PUT', `/api/videos/${video.id}`, data);
      } else {
        // Create new video
        await apiRequest('POST', '/api/videos', data);
      }

      // Invalidate videos queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving video:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save video');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview thumbnail if URL is valid
  const thumbnailUrl = form.watch("thumbnailUrl");
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <ContentEditor
      title={isEditing ? "Edit Video" : "Create Video"}
      description={isEditing ? "Update the video details" : "Add a new video"}
      form={form}
      isEditing={isEditing}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Video title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="thumbnailUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thumbnail URL</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
            </FormControl>
            <FormMessage />
            {isValidUrl(thumbnailUrl) && (
              <div className="mt-2 relative aspect-video w-full max-w-xs rounded-md overflow-hidden">
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail preview" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // Handle image loading error
                    e.currentTarget.src = "https://placehold.co/600x400/gray/white?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video URL</FormLabel>
            <FormControl>
              <Input placeholder="https://youtube.com/watch?v=xxxxx" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="HH:MM:SS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Highlights">Highlights</SelectItem>
                  <SelectItem value="Full Streams">Full Streams</SelectItem>
                  <SelectItem value="Tutorials">Tutorials</SelectItem>
                  <SelectItem value="Vlogs">Vlogs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="views"
          render={({ field }) => (
            <FormItem>
              <FormLabel>View Count</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Published</FormLabel>
              <p className="text-sm text-muted-foreground">
                Make this video visible on the website
              </p>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </ContentEditor>
  );
}
