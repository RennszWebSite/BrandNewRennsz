import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAnnouncementSchema, 
  insertScheduleItemSchema, 
  insertVideoSchema,
  insertSocialLinkSchema
} from "@shared/schema";
import { z } from "zod";

// Authentication middleware
const authenticate = async (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Simple token validation - in a real app use JWT verification
  try {
    // For simplicity, token is just the username
    const user = await storage.getUserByUsername(token);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Add user to request for later use
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid authentication' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  
  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // In a real app, use JWT tokens with proper expiration
      return res.json({ 
        token: user.username, 
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error during authentication' });
    }
  });
  
  // Settings routes
  app.get('/api/settings', async (req, res) => {
    try {
      const twitchUsername = await storage.getSetting('twitchUsername');
      const twitchAltUsername = await storage.getSetting('twitchAltUsername');
      const currentChannel = await storage.getSetting('currentChannel');
      
      // Get social links from the database instead of individual settings
      const socialLinks = await storage.getActiveSocialLinks();
      
      // Format social links for the frontend
      const social: Record<string, string> = {};
      socialLinks.forEach(link => {
        social[link.platform.toLowerCase()] = link.url;
      });
      
      return res.json({
        twitchUsername: twitchUsername?.value || 'Rennsz',
        twitchAltUsername: twitchAltUsername?.value || 'Rennszino',
        currentChannel: currentChannel?.value || 'Rennsz',
        social
      });
      
      // Log the settings request
      storage.sendLogToDiscord('Settings Request', { ip: req.ip }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
    } catch (error) {
      console.error('Settings fetch error:', error);
      return res.status(500).json({ message: 'Error fetching settings' });
    }
  });
  
  app.post('/api/settings', authenticate, async (req, res) => {
    try {
      const { key, value } = req.body;
      
      if (!key || value === undefined) {
        return res.status(400).json({ message: 'Key and value required' });
      }
      
      const setting = await storage.setSetting(key, value);
      
      // Log the settings update
      storage.sendLogToDiscord('Settings Updated', { 
        key, 
        value,
        user: (req as any).user.username
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.json(setting);
    } catch (error) {
      console.error('Settings update error:', error);
      return res.status(500).json({ message: 'Error updating setting' });
    }
  });
  
  // Channel switching endpoint
  app.put('/api/settings/channel', authenticate, async (req, res) => {
    try {
      const { channel } = req.body;
      
      if (!channel) {
        return res.status(400).json({ message: 'Channel name is required' });
      }
      
      // Update the current channel setting
      await storage.setSetting('currentChannel', channel);
      
      // Log the channel change
      storage.sendLogToDiscord('Channel Changed', { 
        channel,
        user: (req as any).user.username,
        ip: req.ip 
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.json({ message: 'Channel updated successfully', channel });
    } catch (error) {
      console.error('Channel update error:', error);
      return res.status(500).json({ message: 'Error updating channel' });
    }
  });
  
  // Announcement routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (limit) {
        const announcements = await storage.getLatestAnnouncements(limit);
        return res.json(announcements);
      } else {
        const announcements = await storage.getAnnouncements();
        return res.json(announcements);
      }
    } catch (error) {
      console.error('Announcements fetch error:', error);
      return res.status(500).json({ message: 'Error fetching announcements' });
    }
  });
  
  app.get('/api/announcements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid announcement ID' });
      }
      
      const announcement = await storage.getAnnouncement(id);
      
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      return res.json(announcement);
    } catch (error) {
      console.error('Announcement fetch error:', error);
      return res.status(500).json({ message: 'Error fetching announcement' });
    }
  });
  
  app.post('/api/announcements', authenticate, async (req, res) => {
    try {
      const validatedData = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedData);
      return res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid announcement data', errors: error.errors });
      }
      console.error('Announcement creation error:', error);
      return res.status(500).json({ message: 'Error creating announcement' });
    }
  });
  
  app.put('/api/announcements/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid announcement ID' });
      }
      
      // Partial validation allowing subset of fields
      const validatedData = insertAnnouncementSchema.partial().parse(req.body);
      
      const updatedAnnouncement = await storage.updateAnnouncement(id, validatedData);
      
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      return res.json(updatedAnnouncement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid announcement data', errors: error.errors });
      }
      console.error('Announcement update error:', error);
      return res.status(500).json({ message: 'Error updating announcement' });
    }
  });
  
  app.delete('/api/announcements/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid announcement ID' });
      }
      
      const success = await storage.deleteAnnouncement(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Announcement deletion error:', error);
      return res.status(500).json({ message: 'Error deleting announcement' });
    }
  });
  
  // Schedule routes
  app.get('/api/schedule', async (req, res) => {
    try {
      const day = req.query.day ? parseInt(req.query.day as string) : undefined;
      
      if (day !== undefined) {
        if (isNaN(day) || day < 0 || day > 6) {
          return res.status(400).json({ message: 'Invalid day value' });
        }
        
        const scheduleItems = await storage.getScheduleItemsByDay(day);
        return res.json(scheduleItems);
      } else {
        const scheduleItems = await storage.getScheduleItems();
        return res.json(scheduleItems);
      }
    } catch (error) {
      console.error('Schedule fetch error:', error);
      return res.status(500).json({ message: 'Error fetching schedule' });
    }
  });
  
  app.get('/api/schedule/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid schedule item ID' });
      }
      
      const scheduleItem = await storage.getScheduleItem(id);
      
      if (!scheduleItem) {
        return res.status(404).json({ message: 'Schedule item not found' });
      }
      
      return res.json(scheduleItem);
    } catch (error) {
      console.error('Schedule item fetch error:', error);
      return res.status(500).json({ message: 'Error fetching schedule item' });
    }
  });
  
  app.post('/api/schedule', authenticate, async (req, res) => {
    try {
      const validatedData = insertScheduleItemSchema.parse(req.body);
      const scheduleItem = await storage.createScheduleItem(validatedData);
      return res.status(201).json(scheduleItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid schedule item data', errors: error.errors });
      }
      console.error('Schedule item creation error:', error);
      return res.status(500).json({ message: 'Error creating schedule item' });
    }
  });
  
  app.put('/api/schedule/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid schedule item ID' });
      }
      
      const validatedData = insertScheduleItemSchema.partial().parse(req.body);
      
      const updatedScheduleItem = await storage.updateScheduleItem(id, validatedData);
      
      if (!updatedScheduleItem) {
        return res.status(404).json({ message: 'Schedule item not found' });
      }
      
      return res.json(updatedScheduleItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid schedule item data', errors: error.errors });
      }
      console.error('Schedule item update error:', error);
      return res.status(500).json({ message: 'Error updating schedule item' });
    }
  });
  
  app.delete('/api/schedule/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid schedule item ID' });
      }
      
      const success = await storage.deleteScheduleItem(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Schedule item not found' });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Schedule item deletion error:', error);
      return res.status(500).json({ message: 'Error deleting schedule item' });
    }
  });
  
  // Video routes
  app.get('/api/videos', async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (type) {
        const videos = await storage.getVideosByType(type);
        return res.json(limit ? videos.slice(0, limit) : videos);
      } else if (limit) {
        const videos = await storage.getLatestVideos(limit);
        return res.json(videos);
      } else {
        const videos = await storage.getVideos();
        return res.json(videos);
      }
    } catch (error) {
      console.error('Videos fetch error:', error);
      return res.status(500).json({ message: 'Error fetching videos' });
    }
  });
  
  app.get('/api/videos/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid video ID' });
      }
      
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      return res.json(video);
    } catch (error) {
      console.error('Video fetch error:', error);
      return res.status(500).json({ message: 'Error fetching video' });
    }
  });
  
  app.post('/api/videos', authenticate, async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      return res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid video data', errors: error.errors });
      }
      console.error('Video creation error:', error);
      return res.status(500).json({ message: 'Error creating video' });
    }
  });
  
  app.put('/api/videos/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid video ID' });
      }
      
      const validatedData = insertVideoSchema.partial().parse(req.body);
      
      const updatedVideo = await storage.updateVideo(id, validatedData);
      
      if (!updatedVideo) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      return res.json(updatedVideo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid video data', errors: error.errors });
      }
      console.error('Video update error:', error);
      return res.status(500).json({ message: 'Error updating video' });
    }
  });
  
  app.delete('/api/videos/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid video ID' });
      }
      
      const success = await storage.deleteVideo(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      return res.json({ success: true });
    } catch (error) {
      console.error('Video deletion error:', error);
      return res.status(500).json({ message: 'Error deleting video' });
    }
  });

  // About Me routes
  app.get('/api/about', async (req, res) => {
    try {
      const aboutMe = await storage.getAboutMe();
      return res.json(aboutMe || { content: '' });
    } catch (error) {
      console.error('Error fetching about me:', error);
      return res.status(500).json({ message: 'Error fetching about me content' });
    }
  });
  
  app.put('/api/about', authenticate, async (req, res) => {
    try {
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }
      
      const aboutMe = await storage.updateAboutMe(content);
      
      // Log the about me update
      storage.sendLogToDiscord('About Me Updated', { 
        user: (req as any).user.username,
        contentLength: content.length
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.json(aboutMe);
    } catch (error) {
      console.error('Error updating about me:', error);
      return res.status(500).json({ message: 'Error updating about me content' });
    }
  });
  
  // Social Links routes
  app.get('/api/social-links', async (req, res) => {
    try {
      const links = await storage.getSocialLinks();
      return res.json(links);
    } catch (error) {
      console.error('Error fetching social links:', error);
      return res.status(500).json({ message: 'Error fetching social links' });
    }
  });
  
  app.post('/api/social-links', authenticate, async (req, res) => {
    try {
      const socialLinkData = insertSocialLinkSchema.parse(req.body);
      const socialLink = await storage.createSocialLink(socialLinkData);
      
      // Log the social link creation
      storage.sendLogToDiscord('Social Link Created', { 
        user: (req as any).user.username,
        platform: socialLink.platform,
        url: socialLink.url
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.status(201).json(socialLink);
    } catch (error) {
      console.error('Error creating social link:', error);
      return res.status(500).json({ message: 'Error creating social link' });
    }
  });
  
  app.put('/api/social-links/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const socialLink = await storage.updateSocialLink(id, updateData);
      
      if (!socialLink) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      
      // Log the social link update
      storage.sendLogToDiscord('Social Link Updated', { 
        user: (req as any).user.username,
        id,
        platform: socialLink.platform,
        url: socialLink.url,
        isActive: socialLink.isActive
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.json(socialLink);
    } catch (error) {
      console.error('Error updating social link:', error);
      return res.status(500).json({ message: 'Error updating social link' });
    }
  });
  
  app.delete('/api/social-links/:id', authenticate, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get the social link before deleting for logging
      const socialLink = await storage.getSocialLink(id);
      
      if (!socialLink) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      
      const success = await storage.deleteSocialLink(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Social link not found' });
      }
      
      // Log the social link deletion
      storage.sendLogToDiscord('Social Link Deleted', { 
        user: (req as any).user.username,
        id,
        platform: socialLink.platform
      }).catch(err => {
        console.error('Error sending Discord webhook:', err);
      });
      
      return res.json({ message: 'Social link deleted' });
    } catch (error) {
      console.error('Error deleting social link:', error);
      return res.status(500).json({ message: 'Error deleting social link' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
