import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

interface SocialLink {
  id: number;
  platform: string;
  displayName: string;
  url: string;
  icon?: string;
  isActive: boolean;
}

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  displayName: z.string().min(1, 'Display name is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

export default function SocialLinksEditor() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<SocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors }
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: '',
      displayName: '',
      url: '',
      isActive: true
    }
  });

  const { data: socialLinks, isLoading, error } = useQuery<SocialLink[]>({
    queryKey: ['/api/social-links'],
  });

  const handleOpenForm = (socialLink?: SocialLink) => {
    if (socialLink) {
      setIsEditing(true);
      setCurrentSocialLink(socialLink);
      setValue('platform', socialLink.platform);
      setValue('displayName', socialLink.displayName);
      setValue('url', socialLink.url);
      setValue('icon', socialLink.icon || '');
      setValue('isActive', socialLink.isActive);
    } else {
      setIsEditing(false);
      setCurrentSocialLink(null);
      reset();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setIsEditing(false);
    setCurrentSocialLink(null);
    reset();
  };

  const onSubmit = async (data: SocialLinkFormValues) => {
    try {
      setIsSubmitting(true);

      if (isEditing && currentSocialLink) {
        await fetch(`/api/social-links/${currentSocialLink.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        toast({
          title: 'Updated',
          description: 'Social link has been updated',
        });
      } else {
        await fetch('/api/social-links', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        toast({
          title: 'Created',
          description: 'Social link has been created',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
      handleCloseForm();
    } catch (error) {
      console.error('Error saving social link:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save social link',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`/api/social-links/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !currentStatus,
        }),
      });

      toast({
        title: 'Updated',
        description: `Social link ${currentStatus ? 'deactivated' : 'activated'}`,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
    } catch (error) {
      console.error('Error toggling social link status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update social link status',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id);

      await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      });

      toast({
        title: 'Deleted',
        description: 'Social link has been deleted',
      });

      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
    } catch (error) {
      console.error('Error deleting social link:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete social link',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You must be logged in to manage social links.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Media Links</h2>
          <p className="text-muted-foreground">Manage your social media presence</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="col-span-full">
            <AlertDescription>
              Failed to load social links. Please try again.
            </AlertDescription>
          </Alert>
        ) : socialLinks && socialLinks.length > 0 ? (
          socialLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {link.platform}
                </CardTitle>
                <CardDescription>{link.displayName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary truncate"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <Switch
                      checked={link.isActive}
                      onCheckedChange={() => handleToggleActive(link.id, link.isActive)}
                    />
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenForm(link)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        disabled={isDeleting === link.id}
                        onClick={() => handleDelete(link.id)}
                      >
                        {isDeleting === link.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground mb-4">No social links added yet</p>
            <Button onClick={() => handleOpenForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Social Link
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Social Link' : 'Add New Social Link'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update your social media link details' 
                : 'Add a new social media platform to your profile'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                placeholder="e.g., Twitter, Instagram, YouTube"
                {...register('platform')}
              />
              {errors.platform && (
                <p className="text-sm font-medium text-destructive">{errors.platform.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="e.g., @username, Channel Name"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p className="text-sm font-medium text-destructive">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://"
                {...register('url')}
              />
              {errors.url && (
                <p className="text-sm font-medium text-destructive">{errors.url.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                {...register('isActive')}
                defaultChecked={true}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update' : 'Create'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}