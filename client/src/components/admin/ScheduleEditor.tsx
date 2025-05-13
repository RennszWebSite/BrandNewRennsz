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
import ContentEditor from "./ContentEditor";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the schedule item form schema
const scheduleItemFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in format HH:MM (24h)",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in format HH:MM (24h)",
  }),
  timeZone: z.string().min(1, { message: "Time zone is required" }),
});

type ScheduleItemFormValues = z.infer<typeof scheduleItemFormSchema>;

interface ScheduleEditorProps {
  scheduleItem?: {
    id: number;
    title: string;
    description: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timeZone: string;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ScheduleEditor({ 
  scheduleItem, 
  onSuccess, 
  onCancel 
}: ScheduleEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isEditing = !!scheduleItem;

  const form = useForm<ScheduleItemFormValues>({
    resolver: zodResolver(scheduleItemFormSchema),
    defaultValues: {
      title: scheduleItem?.title || "",
      description: scheduleItem?.description || "",
      dayOfWeek: scheduleItem?.dayOfWeek || 0,
      startTime: scheduleItem?.startTime || "",
      endTime: scheduleItem?.endTime || "",
      timeZone: scheduleItem?.timeZone || "EST",
    },
  });

  const onSubmit = async (data: ScheduleItemFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing && scheduleItem) {
        // Update existing schedule item
        await apiRequest('PUT', `/api/schedule/${scheduleItem.id}`, data);
      } else {
        // Create new schedule item
        await apiRequest('POST', '/api/schedule', data);
      }

      // Invalidate schedule queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving schedule item:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save schedule item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeZones = ["EST", "CST", "MST", "PST", "UTC", "GMT", "BST", "CET", "IST", "JST", "AEST"];

  return (
    <ContentEditor
      title={isEditing ? "Edit Schedule Item" : "Create Schedule Item"}
      description={isEditing ? "Update the schedule item details" : "Create a new schedule item"}
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
              <Input placeholder="Stream title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input placeholder="Brief description of the stream" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="dayOfWeek"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Day of Week</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select day of week" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dayNames.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time (24h)</FormLabel>
              <FormControl>
                <Input placeholder="HH:MM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time (24h)</FormLabel>
              <FormControl>
                <Input placeholder="HH:MM" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="timeZone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Zone</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeZones.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </ContentEditor>
  );
}
