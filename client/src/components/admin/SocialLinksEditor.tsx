import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Pencil, Trash2, Globe, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  SiYoutube, SiX, SiInstagram, SiTwitch, 
  SiTiktok, SiDiscord, SiFacebook, SiLinkedin, 
  SiSubstack, SiPatreon, SiKofi
} from 'react-icons/si';

// Icons mapping for different platforms
const platformIcons: Record<string, any> = {
  youtube: SiYoutube,
  twitter: SiX,
  x: SiX,
  instagram: SiInstagram,
  twitch: SiTwitch,
  tiktok: SiTiktok,
  discord: SiDiscord,
  facebook: SiFacebook,
  linkedin: SiLinkedin,
  substack: SiSubstack,
  patreon: SiPatreon,
  kofi: SiKofi
};

// Form validation schema
const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  displayName: z.string().min(1, 'Display name is required'),
  url: z.string().url('Please enter a valid URL'),
  icon: z.string().optional(),
  isActive: z.boolean().default(true)
});

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;

interface SocialLink {
  id: number;
  platform: string;
  displayName: string;
  url: string;
  icon?: string;
  isActive: boolean;
}

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
  
  // Fetch social links
  const { data: socialLinks, isLoading, error, refetch } = useQuery<SocialLink[]>({
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
        // Update existing social link
        await apiRequest('PUT', `/api/social-links/${currentSocialLink.id}`, data);
        toast({
          title: 'Success',
          description: 'Social link updated successfully',
        });
      } else {
        // Create new social link
        await apiRequest('POST', '/api/social-links', data);
        toast({
          title: 'Success',
          description: 'Social link added successfully',
        });
      }
      
      // Refresh social links
      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
      
      // Close form
      handleCloseForm();
    } catch (error) {
      console.error('Error saving social link:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: isEditing 
          ? 'Failed to update social link' 
          : 'Failed to add social link',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleToggleActive = async (socialLink: SocialLink) => {
    try {
      await apiRequest('PUT', `/api/social-links/${socialLink.id}`, {
        ...socialLink,
        isActive: !socialLink.isActive
      });
      
      toast({
        title: 'Status Updated',
        description: `Social link is now ${!socialLink.isActive ? 'active' : 'inactive'}`,
      });
      
      // Refresh social links
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
      
      await apiRequest('DELETE', `/api/social-links/${id}`);
      
      toast({
        title: 'Deleted',
        description: 'Social link has been deleted',
      });
      
      // Refresh social links
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
  
  // Function to get icon component
  const getPlatformIcon = (platform: string) => {
    const lowercasePlatform = platform.toLowerCase();
    return platformIcons[lowercasePlatform] || Globe;
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
      
      {/* Social Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Social Links</CardTitle>
          <CardDescription>
            Links that appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load social links. Please try again.
              </AlertDescription>
            </Alert>
          ) : socialLinks && socialLinks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialLinks.map((link: SocialLink) => {
                  const IconComponent = getPlatformIcon(link.platform);
                  return (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <IconComponent className="h-4 w-4 mr-2" />
                          {link.platform}
                        </div>
                      </TableCell>
                      <TableCell>{link.displayName}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {link.url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={() => handleToggleActive(link)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No social links added yet</p>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Social Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add/Edit Form Dialog */}
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
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
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
              
              <div className="grid gap-2">
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
              
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  placeholder="https://..."
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
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </>
                    )}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}