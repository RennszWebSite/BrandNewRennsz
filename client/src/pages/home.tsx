import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import CurrentStream from "@/components/home/CurrentStream";
import Announcements from "@/components/home/Announcements";
import Schedule from "@/components/home/Schedule";
import Videos from "@/components/home/Videos";
import AboutSection from "@/components/about/AboutSection";
import ContactSection from "@/components/contact/ContactSection";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: settings, error, isLoading } = useQuery({
    queryKey: ['/api/settings'],
  });

  // Add active class to nav links based on scroll position
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = () => {
      let current = '';
      
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        
        if (sectionTop < 100) {
          current = section.getAttribute('id') || '';
        }
      });
      
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) return <LoadingState fullscreen />;
  if (error) return <ErrorState message="Failed to load settings" />;

  return (
    <>
      <Hero isLive={settings?.streamStatus === 'online'} viewerCount={settings?.viewerCount} />
      <CurrentStream twitchUsername={settings?.twitchUsername} />
      <Announcements />
      <Schedule />
      <Videos />
      <AboutSection socialLinks={settings?.social} />
      <ContactSection />
    </>
  );
}
