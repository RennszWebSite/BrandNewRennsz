import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from '@neondatabase/serverless';
import { 
  users, announcements, scheduleItems, videos, settings
} from "@shared/schema";

// Import the dbStorage configuration to reuse the same connection setup
import { dbStorage } from './dbStorage';

// Function to create sample data
async function seedDatabase() {
  try {
    const db = drizzle(new Pool({
      connectionString: process.env.DATABASE_URL,
    } as any));

    // Create tables
    console.log('Creating tables if they don\'t exist...');
    
    // Check if admin user exists
    const adminUser = await dbStorage.getUserByUsername('admin');
    
    if (!adminUser) {
      console.log('Creating admin user...');
      await dbStorage.createUser({
        username: "admin",
        password: "Rennsz5842",
        isAdmin: true
      });
    }
    
    // Check if we need to add sample data
    const announcements = await dbStorage.getAnnouncements();
    
    if (announcements.length === 0) {
      console.log('Adding sample announcements...');
      await dbStorage.createAnnouncement({
        title: "New Emotes Released!",
        content: "Check out the new channel emotes available for subscribers! Six new emotes are now live.",
        type: "NEW",
        published: true
      });
      
      await dbStorage.createAnnouncement({
        title: "Schedule Update",
        content: "Stream schedule has been updated for next week. Check the schedule section for details!",
        type: "IMPORTANT",
        published: true
      });
      
      await dbStorage.createAnnouncement({
        title: "Community Tournament",
        content: "Join our upcoming community tournament next Saturday with prizes for the top players!",
        type: "EVENT",
        published: true
      });
    }
    
    // Check schedule items
    const scheduleItems = await dbStorage.getScheduleItems();
    
    if (scheduleItems.length === 0) {
      console.log('Adding sample schedule items...');
      await dbStorage.createScheduleItem({
        title: "Ranked Matches",
        description: "Competitive gameplay with viewer callouts",
        dayOfWeek: 1, // Monday
        startTime: "18:00",
        endTime: "21:00",
        timeZone: "EST"
      });
      
      await dbStorage.createScheduleItem({
        title: "Community Game Night",
        description: "Playing games with subscribers and viewers",
        dayOfWeek: 2, // Tuesday
        startTime: "19:00",
        endTime: "22:00",
        timeZone: "EST"
      });
    }
    
    // Check videos
    const videos = await dbStorage.getVideos();
    
    if (videos.length === 0) {
      console.log('Adding sample videos...');
      await dbStorage.createVideo({
        title: "Insane 1v5 Clutch Moment - You Won't Believe It!",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3",
        videoUrl: "https://www.youtube.com/watch?v=example1",
        duration: "15:42",
        type: "Highlights",
        views: 2300,
        published: true
      });
      
      await dbStorage.createVideo({
        title: "Weekly Highlights Compilation - Best Moments",
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3",
        videoUrl: "https://www.youtube.com/watch?v=example2",
        duration: "23:17",
        type: "Highlights",
        views: 1700,
        published: true
      });
      
      await dbStorage.createVideo({
        title: "Full Stream - Tournament Qualifiers w/ Team",
        thumbnailUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3",
        videoUrl: "https://www.youtube.com/watch?v=example3",
        duration: "3:42:15",
        type: "Full Streams",
        views: 5800,
        published: true
      });
    }
    
    // Check settings
    const streamStatusSetting = await dbStorage.getSetting("streamStatus");
    if (!streamStatusSetting) {
      console.log('Adding default settings...');
      await dbStorage.setSetting("streamStatus", "online");
      await dbStorage.setSetting("viewerCount", "3200");
      await dbStorage.setSetting("twitchUsername", "Rennsz");
      await dbStorage.setSetting("youtubeUrl", "https://youtube.com/user/Rennsz");
      await dbStorage.setSetting("twitterUrl", "https://twitter.com/Rennsz");
      await dbStorage.setSetting("instagramUrl", "https://instagram.com/Rennsz");
      await dbStorage.setSetting("discordUrl", "https://discord.gg/Rennsz");
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the migration
seedDatabase();