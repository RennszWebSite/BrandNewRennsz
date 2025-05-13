import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, and, desc } from 'drizzle-orm';
import { Pool } from '@neondatabase/serverless';
import { 
  users, type User, type InsertUser,
  announcements, type Announcement, type InsertAnnouncement,
  scheduleItems, type ScheduleItem, type InsertScheduleItem,
  videos, type Video, type InsertVideo,
  settings, type Setting, type InsertSetting
} from "@shared/schema";
import { IStorage } from './storage';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Configure database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }
  
  async getLatestAnnouncements(limit: number): Promise<Announcement[]> {
    return await db.select()
      .from(announcements)
      .where(eq(announcements.published, true))
      .orderBy(desc(announcements.createdAt))
      .limit(limit);
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id));
    return result[0];
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement).returning();
    return result[0];
  }
  
  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements)
      .set(announcement)
      .where(eq(announcements.id, id))
      .returning();
    return result[0];
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    const result = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    return result.length > 0;
  }
  
  // Schedule operations
  async getScheduleItems(): Promise<ScheduleItem[]> {
    return await db.select().from(scheduleItems)
      .orderBy(scheduleItems.dayOfWeek, scheduleItems.startTime);
  }
  
  async getScheduleItemsByDay(dayOfWeek: number): Promise<ScheduleItem[]> {
    return await db.select()
      .from(scheduleItems)
      .where(eq(scheduleItems.dayOfWeek, dayOfWeek))
      .orderBy(scheduleItems.startTime);
  }
  
  async getScheduleItem(id: number): Promise<ScheduleItem | undefined> {
    const result = await db.select().from(scheduleItems).where(eq(scheduleItems.id, id));
    return result[0];
  }
  
  async createScheduleItem(scheduleItem: InsertScheduleItem): Promise<ScheduleItem> {
    const result = await db.insert(scheduleItems).values(scheduleItem).returning();
    return result[0];
  }
  
  async updateScheduleItem(id: number, scheduleItem: Partial<InsertScheduleItem>): Promise<ScheduleItem | undefined> {
    const result = await db.update(scheduleItems)
      .set(scheduleItem)
      .where(eq(scheduleItems.id, id))
      .returning();
    return result[0];
  }
  
  async deleteScheduleItem(id: number): Promise<boolean> {
    const result = await db.delete(scheduleItems).where(eq(scheduleItems.id, id)).returning();
    return result.length > 0;
  }
  
  // Video operations
  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(desc(videos.createdAt));
  }
  
  async getVideosByType(type: string): Promise<Video[]> {
    return await db.select()
      .from(videos)
      .where(and(
        eq(videos.type, type),
        eq(videos.published, true)
      ))
      .orderBy(desc(videos.createdAt));
  }
  
  async getLatestVideos(limit: number): Promise<Video[]> {
    return await db.select()
      .from(videos)
      .where(eq(videos.published, true))
      .orderBy(desc(videos.createdAt))
      .limit(limit);
  }
  
  async getVideo(id: number): Promise<Video | undefined> {
    const result = await db.select().from(videos).where(eq(videos.id, id));
    return result[0];
  }
  
  async createVideo(video: InsertVideo): Promise<Video> {
    const result = await db.insert(videos).values(video).returning();
    return result[0];
  }
  
  async updateVideo(id: number, video: Partial<InsertVideo>): Promise<Video | undefined> {
    const result = await db.update(videos)
      .set(video)
      .where(eq(videos.id, id))
      .returning();
    return result[0];
  }
  
  async deleteVideo(id: number): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id)).returning();
    return result.length > 0;
  }
  
  // Settings operations
  async getSetting(key: string): Promise<Setting | undefined> {
    const result = await db.select().from(settings).where(eq(settings.key, key));
    return result[0];
  }
  
  async setSetting(key: string, value: string): Promise<Setting> {
    // Check if setting exists
    const existingSetting = await this.getSetting(key);
    
    if (existingSetting) {
      // Update existing setting
      const result = await db.update(settings)
        .set({ value })
        .where(eq(settings.key, key))
        .returning();
      return result[0];
    } else {
      // Create new setting
      const result = await db.insert(settings)
        .values({ key, value })
        .returning();
      return result[0];
    }
  }
}

export const dbStorage = new DbStorage();