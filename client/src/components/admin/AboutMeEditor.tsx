import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AboutMeEditorProps {
  onSuccess?: () => void;
}

interface FormValues {
  content: string;
}

export default function AboutMeEditor({ onSuccess }: AboutMeEditorProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      content: ''
    }
  });
  
  // Fetch the current about me content
  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest('GET', '/api/about');
        
        if (response.content) {
          setValue('content', response.content);
        }
        
      } catch (error) {
        console.error('Error fetching about me:', error);
        setError('Failed to load content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAboutMe();
  }, [setValue]);
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);
      setError(null);
      
      await apiRequest('PUT', '/api/about', data);
      
      toast({
        title: 'About Me Updated',
        description: 'Your about me section was successfully updated.',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating about me:', error);
      setError('Failed to save changes. Please try again.');
      
      toast({
        variant: "destructive",
        title: 'Update Failed',
        description: 'Could not update about me section.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You must be logged in to edit the About Me section.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit About Me</CardTitle>
        <CardDescription>
          Update your personal introduction that will be displayed on your website.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="content">About Me Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write something about yourself..."
                  className="h-40 resize-none"
                  {...register('content', { 
                    required: 'Content is required',
                    minLength: {
                      value: 10,
                      message: 'Content should be at least 10 characters long'
                    }
                  })}
                />
                {errors.content && (
                  <p className="text-sm font-medium text-destructive">{errors.content.message}</p>
                )}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isLoading || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}