import { 
  users, type User, type InsertUser,
  announcements, type Announcement, type InsertAnnouncement,
  scheduleItems, type ScheduleItem, type InsertScheduleItem,
  videos, type Video, type InsertVideo,
  aboutMe, type AboutMe, type InsertAboutMe,
  socialLinks, type SocialLink, type InsertSocialLink,
  settings, type Setting, type InsertSetting
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  getLatestAnnouncements(limit: number): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Schedule operations
  getScheduleItems(): Promise<ScheduleItem[]>;
  getScheduleItemsByDay(dayOfWeek: number): Promise<ScheduleItem[]>;
  getScheduleItem(id: number): Promise<ScheduleItem | undefined>;
  createScheduleItem(scheduleItem: InsertScheduleItem): Promise<ScheduleItem>;
  updateScheduleItem(id: number, scheduleItem: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined>;
  deleteScheduleItem(id: number): Promise<boolean>;
  
  // Video operations
  getVideos(): Promise<Video[]>;
  getVideosByType(type: string): Promise<Video[]>;
  getLatestVideos(limit: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;
  
  // About Me operations
  getAboutMe(): Promise<AboutMe | undefined>;
  updateAboutMe(content: string): Promise<AboutMe>;
  
  // Social Media Links operations
  getSocialLinks(): Promise<SocialLink[]>;
  getActiveSocialLinks(): Promise<SocialLink[]>;
  getSocialLink(id: number): Promise<SocialLink | undefined>;
  createSocialLink(socialLink: InsertSocialLink): Promise<SocialLink>;
  updateSocialLink(id: number, socialLink: Partial<InsertSocialLink>): Promise<SocialLink | undefined>;
  deleteSocialLink(id: number): Promise<boolean>;
  
  // Settings operations
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(key: string, value: string): Promise<Setting>;
  
  // Discord webhook logging
  sendLogToDiscord(event: string, data: any): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userCurrentId: number;
  
  private announcements: Map<number, Announcement>;
  private announcementCurrentId: number;
  
  private scheduleItems: Map<number, ScheduleItem>;
  private scheduleItemCurrentId: number;
  
  private videos: Map<number, Video>;
  private videoCurrentId: number;
  
  private aboutMeData: Map<number, AboutMe>;
  private aboutMeCurrentId: number;
  
  private socialLinksData: Map<number, SocialLink>;
  private socialLinkCurrentId: number;
  
  private settings: Map<string, Setting>;
  private settingCurrentId: number;

  constructor() {
    this.users = new Map();
    this.userCurrentId = 1;
    
    this.announcements = new Map();
    this.announcementCurrentId = 1;
    
    this.scheduleItems = new Map();
    this.scheduleItemCurrentId = 1;
    
    this.videos = new Map();
    this.videoCurrentId = 1;
    
    this.aboutMeData = new Map();
    this.aboutMeCurrentId = 1;
    
    this.socialLinksData = new Map();
    this.socialLinkCurrentId = 1;
    
    this.settings = new Map();
    this.settingCurrentId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "Rennsz5842",
      isAdmin: true
    });
    
    // Add sample data
    this.initializeData();
  }

  // Initialize sample data
  private initializeData() {
    // Add sample announcements
    this.createAnnouncement({
      title: "New Emotes Released!",
      content: "Check out the new channel emotes available for subscribers! Six new emotes are now live.",
      type: "NEW",
      published: true
    });
    
    this.createAnnouncement({
      title: "Schedule Update",
      content: "Stream schedule has been updated for next week. Check the schedule section for details!",
      type: "IMPORTANT",
      published: true
    });
    
    this.createAnnouncement({
      title: "Community Tournament",
      content: "Join our upcoming community tournament next Saturday with prizes for the top players!",
      type: "EVENT",
      published: true
    });
    
    // Add schedule items
    this.createScheduleItem({
      title: "Ranked Matches",
      description: "Competitive gameplay with viewer callouts",
      dayOfWeek: 1, // Monday
      startTime: "18:00",
      endTime: "21:00",
      timeZone: "EST"
    });
    
    this.createScheduleItem({
      title: "Community Game Night",
      description: "Playing games with subscribers and viewers",
      dayOfWeek: 2, // Tuesday
      startTime: "19:00",
      endTime: "22:00",
      timeZone: "EST"
    });
    
    // Add videos
    this.createVideo({
      title: "Insane 1v5 Clutch Moment - You Won't Believe It!",
      thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3",
      videoUrl: "https://www.youtube.com/watch?v=example1",
      duration: "15:42",
      type: "Highlights",
      views: 2300,
      published: true
    });
    
    this.createVideo({
      title: "Weekly Highlights Compilation - Best Moments",
      thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3",
      videoUrl: "https://www.youtube.com/watch?v=example2",
      duration: "23:17",
      type: "Highlights",
      views: 1700,
      published: true
    });
    
    this.createVideo({
      title: "Full Stream - Tournament Qualifiers w/ Team",
      thumbnailUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3",
      videoUrl: "https://www.youtube.com/watch?v=example3",
      duration: "3:42:15",
      type: "Full Streams",
      views: 5800,
      published: true
    });
    
    // Add about me content
    this.updateAboutMe("Hey everyone! I'm Rennsz, a passionate streamer dedicated to creating entertaining content. Whether on my IRL channel (Rennsz) or my gaming channel (Rennszino), I strive to create a welcoming community where viewers can relax and have fun. Join me for an exciting mix of real-life adventures and gaming sessions!");
    
    // Add social media links
    this.createSocialLink({
      platform: "Youtube",
      url: "https://youtube.com/user/Rennsz",
      displayName: "Rennsz",
      icon: "SiYoutube",
      isActive: true
    });
    
    this.createSocialLink({
      platform: "Twitter",
      url: "https://twitter.com/Rennsz",
      displayName: "@Rennsz",
      icon: "SiTwitter",
      isActive: true
    });
    
    this.createSocialLink({
      platform: "Instagram",
      url: "https://instagram.com/Rennsz",
      displayName: "@Rennsz",
      icon: "SiInstagram",
      isActive: true
    });
    
    this.createSocialLink({
      platform: "Discord",
      url: "https://discord.gg/Rennsz",
      displayName: "Rennsz Community",
      icon: "SiDiscord",
      isActive: true
    });
    
    this.createSocialLink({
      platform: "Twitch",
      url: "https://twitch.tv/Rennsz",
      displayName: "Rennsz",
      icon: "SiTwitch",
      isActive: true
    });
    
    // Add settings
    this.setSetting("twitchUsername", "Rennsz");
    this.setSetting("twitchAltUsername", "Rennszino");
    this.setSetting("currentChannel", "Rennsz");
    this.setSetting("discordWebhookUrl", "https://discord.com/api/webhooks/1365497995558387763/A8YNKwHabFEjWc4_3uJCCsZIn5fbz5S4C-oDIwMmDBZNMkR892xPpgNOlN_HZHt9x7hs");
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
  
  async getLatestAnnouncements(limit: number): Promise<Announcement[]> {
    return (await this.getAnnouncements())
      .filter(announcement => announcement.published)
      .slice(0, limit);
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementCurrentId++;
    const now = new Date();
    const announcement: Announcement = { 
      ...insertAnnouncement, 
      id, 
      createdAt: now
    };
    this.announcements.set(id, announcement);
    return announcement;
  }
  
  async updateAnnouncement(id: number, updateData: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement: Announcement = { 
      ...announcement, 
      ...updateData
    };
    
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }
  
  // Schedule operations
  async getScheduleItems(): Promise<ScheduleItem[]> {
    return Array.from(this.scheduleItems.values())
      .sort((a, b) => (a.dayOfWeek * 100 + parseInt(a.startTime.replace(':', ''))) - 
                      (b.dayOfWeek * 100 + parseInt(b.startTime.replace(':', ''))));
  }
  
  async getScheduleItemsByDay(dayOfWeek: number): Promise<ScheduleItem[]> {
    return (await this.getScheduleItems())
      .filter(item => item.dayOfWeek === dayOfWeek);
  }
  
  async getScheduleItem(id: number): Promise<ScheduleItem | undefined> {
    return this.scheduleItems.get(id);
  }
  
  async createScheduleItem(insertScheduleItem: InsertScheduleItem): Promise<ScheduleItem> {
    const id = this.scheduleItemCurrentId++;
    const scheduleItem: ScheduleItem = { ...insertScheduleItem, id };
    this.scheduleItems.set(id, scheduleItem);
    return scheduleItem;
  }
  
  async updateScheduleItem(id: number, updateData: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined> {
    const scheduleItem = this.scheduleItems.get(id);
    if (!scheduleItem) return undefined;
    
    const updatedScheduleItem: ScheduleItem = { 
      ...scheduleItem, 
      ...updateData
    };
    
    this.scheduleItems.set(id, updatedScheduleItem);
    return updatedScheduleItem;
  }
  
  async deleteScheduleItem(id: number): Promise<boolean> {
    return this.scheduleItems.delete(id);
  }
  
  // Video operations
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values())
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }
  
  async getVideosByType(type: string): Promise<Video[]> {
    return (await this.getVideos())
      .filter(video => video.type === type && video.published);
  }
  
  async getLatestVideos(limit: number): Promise<Video[]> {
    return (await this.getVideos())
      .filter(video => video.published)
      .slice(0, limit);
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }
  
  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.videoCurrentId++;
    const now = new Date();
    const video: Video = { 
      ...insertVideo, 
      id, 
      createdAt: now
    };
    this.videos.set(id, video);
    return video;
  }
  
  async updateVideo(id: number, updateData: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo: Video = { 
      ...video, 
      ...updateData
    };
    
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }
  
  async deleteVideo(id: number): Promise<boolean> {
    return this.videos.delete(id);
  }
  
  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }
  
  async setSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = this.settings.get(key);
    
    if (existingSetting) {
      const updatedSetting: Setting = { ...existingSetting, value };
      this.settings.set(key, updatedSetting);
      return updatedSetting;
    } else {
      const id = this.settingCurrentId++;
      const setting: Setting = { id, key, value };
      this.settings.set(key, setting);
      return setting;
    }
  }
  
  // About Me operations
  async getAboutMe(): Promise<AboutMe | undefined> {
    // Get the first about me entry (there should only be one)
    const aboutMeEntries = Array.from(this.aboutMeData.values());
    return aboutMeEntries.length > 0 ? aboutMeEntries[0] : undefined;
  }
  
  async updateAboutMe(content: string): Promise<AboutMe> {
    const existingAboutMe = await this.getAboutMe();
    
    if (existingAboutMe) {
      const updated: AboutMe = { 
        ...existingAboutMe, 
        content,
        updatedAt: new Date()
      };
      this.aboutMeData.set(existingAboutMe.id, updated);
      return updated;
    } else {
      const id = this.aboutMeCurrentId++;
      const now = new Date();
      const aboutMe: AboutMe = { 
        id, 
        content, 
        updatedAt: now 
      };
      this.aboutMeData.set(id, aboutMe);
      return aboutMe;
    }
  }
  
  // Social Media Links operations
  async getSocialLinks(): Promise<SocialLink[]> {
    return Array.from(this.socialLinksData.values())
      .sort((a, b) => a.platform.localeCompare(b.platform));
  }
  
  async getActiveSocialLinks(): Promise<SocialLink[]> {
    return (await this.getSocialLinks())
      .filter(link => link.isActive);
  }
  
  async getSocialLink(id: number): Promise<SocialLink | undefined> {
    return this.socialLinksData.get(id);
  }
  
  async createSocialLink(insertSocialLink: InsertSocialLink): Promise<SocialLink> {
    const id = this.socialLinkCurrentId++;
    const socialLink: SocialLink = { ...insertSocialLink, id };
    this.socialLinksData.set(id, socialLink);
    return socialLink;
  }
  
  async updateSocialLink(id: number, updateData: Partial<InsertSocialLink>): Promise<SocialLink | undefined> {
    const socialLink = this.socialLinksData.get(id);
    if (!socialLink) return undefined;
    
    const updatedSocialLink: SocialLink = { 
      ...socialLink, 
      ...updateData
    };
    
    this.socialLinksData.set(id, updatedSocialLink);
    return updatedSocialLink;
  }
  
  async deleteSocialLink(id: number): Promise<boolean> {
    return this.socialLinksData.delete(id);
  }
  
  // Discord webhook logging
  async sendLogToDiscord(event: string, data: any): Promise<void> {
    const webhook = await this.getSetting("discordWebhookUrl");
    if (!webhook) return;
    
    const content = {
      username: "Rennsz Website",
      embeds: [{
        title: `Event: ${event}`,
        description: typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data),
        color: 16750848, // Orange color
        timestamp: new Date().toISOString()
      }]
    };
    
    try {
      // Use fetch to send the webhook
      fetch(webhook.value, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      }).catch(err => console.error('Error sending Discord webhook:', err));
    } catch (error) {
      console.error('Error sending Discord webhook:', error);
    }
  }
}

// Import the database storage
import { dbStorage } from './dbStorage';

// Use memory storage as a fallback if the database connection fails
// Export the database storage by default, but can be overridden to use memory storage
export let storage: IStorage = new MemStorage();

// Set up the database storage
async function setupStorage() {
  try {
    // Test database connection by fetching a setting
    await dbStorage.getSetting('test');
    
    // If we get here, the connection was successful
    console.log('Successfully connected to database, using DB storage');
    storage = dbStorage;
  } catch (error) {
    console.error('Failed to connect to database, using in-memory storage as fallback:', error);
    // Keep using memory storage
  }
}

// Initialize storage
setupStorage();
