import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiYoutube, SiX, SiInstagram, SiTwitch, SiDiscord } from 'react-icons/si';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialLinks {
  youtube?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
}

interface AboutMeResponse {
  id: number;
  content: string;
}

interface AboutSectionProps {
  socialLinks?: SocialLinks;
}

export default function AboutSection({ socialLinks }: AboutSectionProps) {
  const { data: aboutMe, isLoading, error } = useQuery<AboutMeResponse>({
    queryKey: ['/api/about'],
  });

  const { data: activeSocialLinks, isLoading: isLoadingSocial } = useQuery({
    queryKey: ['/api/social-links'],
  });

  const formatContent = (content: string) => {
    return content.split('\\n').map((line, i) => (
      <p key={i} className="mb-4">
        {line}
      </p>
    ));
  };

  return (
    <section id="about" className="py-16 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Card className="lg:col-span-12 border-none shadow-md">
            <CardHeader className="pb-3">
              <CardTitle>Hey there!</CardTitle>
              <CardDescription>Get to know me better</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <p className="text-muted-foreground">
                  Could not load content. Please try again later.
                </p>
              ) : aboutMe?.content ? (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>Content coming soon!</p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No content available. Check back soon!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}