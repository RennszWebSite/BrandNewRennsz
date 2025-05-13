import { Radio, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import rennsz from "@assets/IMG_2456.png";

interface HeroProps {
  isLive?: boolean;
  viewerCount?: string;
}

export default function Hero({ isLive = false, viewerCount = "0" }: HeroProps) {
  return (
    <section id="home" className="relative overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-secondary via-secondary/90 to-transparent opacity-80"></div>
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: "radial-gradient(circle at center, rgba(255,85,0,0.1) 0%, transparent 70%)" }}
      ></div>
      
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between relative z-10">
        <motion.div 
          className="lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
            <span className="text-white">Welcome to</span>
            <span className="block text-primary">RENNSZ</span>
            <span className="text-white">Stream</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
            Join the community for epic gameplay, entertaining commentary, and unforgettable streaming moments!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              asChild
              className="w-full sm:w-auto"
            >
              <a 
                href={`https://twitch.tv/${isLive ? 'Rennsz' : 'Rennsz'}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Radio className="mr-2 h-5 w-5" /> Watch Live
              </a>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <a href="#schedule">
                <CalendarIcon className="mr-2 h-5 w-5" /> Schedule
              </a>
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          className="lg:w-1/2 flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <img 
              src={rennsz} 
              alt="Rennsz Streamer" 
              className="w-full max-w-md lg:max-w-lg rounded-lg shadow-2xl" 
            />
            
            {isLive && (
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary/80 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-3">
                <div className="flex items-center">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="ml-2 font-medium">LIVE</span>
                </div>
                <span className="text-sm opacity-80">•</span>
                <span className="text-sm">{viewerCount} viewers</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
