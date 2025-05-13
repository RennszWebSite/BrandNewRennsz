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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ContentEditor from "./ContentEditor";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the announcement form schema
const announcementFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  published: z.boolean().default(true),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

interface AnnouncementEditorProps {
  announcement?: {
    id: number;
    title: string;
    content: string;
    type: string;
    published: boolean;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AnnouncementEditor({ 
  announcement, 
  onSuccess, 
  onCancel 
}: AnnouncementEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isEditing = !!announcement;

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      type: announcement?.type || "",
      published: announcement?.published ?? true,
    },
  });

  const onSubmit = async (data: AnnouncementFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing && announcement) {
        // Update existing announcement
        await apiRequest('PUT', `/api/announcements/${announcement.id}`, data);
      } else {
        // Create new announcement
        await apiRequest('POST', '/api/announcements', data);
      }

      // Invalidate announcements queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContentEditor
      title={isEditing ? "Edit Announcement" : "Create Announcement"}
      description={isEditing ? "Update the announcement details" : "Create a new announcement"}
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
              <Input placeholder="Announcement title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Announcement content" 
                rows={5} 
                {...field} 
              />
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
                  <SelectValue placeholder="Select announcement type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IMPORTANT">Important</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Published</FormLabel>
              <p className="text-sm text-muted-foreground">
                Make this announcement visible on the website
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
