import { useState } from "react";
import { RectangleEllipsis } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FaHandHoldingUsd, FaPatreon, FaTwitch, FaYoutube } from "react-icons/fa";

// Define the contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would send the form data to a backend API
      // For now, we'll simulate a successful submission after a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out! We'll get back to you soon.",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 bg-gradient-to-b from-secondary/75 to-secondary/70">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-8">
          <RectangleEllipsis className="inline-block text-primary mr-2" /> Contact & Support
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-montserrat font-bold mb-6">Get In Touch</h3>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="business">Business Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Your message here..." 
                              rows={5} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/2">
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-montserrat font-bold mb-4">Support the Stream</h3>
                
                <p className="text-muted-foreground mb-6">
                  If you enjoy my content and want to support the channel, here are some ways you can help:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="https://twitch.tv/Rennsz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/40 p-4 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#9146FF] rounded-lg flex items-center justify-center">
                      <FaTwitch className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Subscribe</h4>
                      <p className="text-xs text-muted-foreground">Support monthly via Twitch</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/40 p-4 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#F96854] rounded-lg flex items-center justify-center">
                      <FaPatreon className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Patreon</h4>
                      <p className="text-xs text-muted-foreground">Exclusive perks and content</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/40 p-4 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#FFDD00] rounded-lg flex items-center justify-center">
                      <FaHandHoldingUsd className="text-black" />
                    </div>
                    <div>
                      <h4 className="font-medium">Donate</h4>
                      <p className="text-xs text-muted-foreground">One-time support</p>
                    </div>
                  </a>
                  
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 bg-muted/30 hover:bg-muted/40 p-4 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#FF0000] rounded-lg flex items-center justify-center">
                      <FaYoutube className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">YouTube</h4>
                      <p className="text-xs text-muted-foreground">Subscribe & share videos</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20 border-border overflow-hidden shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-montserrat font-bold mb-4">FAQ</h3>
                
                <div className="space-y-4">
                  <div className="border-b border-border pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="text-primary mr-2">Q:</span>
                      What games do you primarily stream?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      I mainly focus on competitive FPS games like Valorant, Apex Legends, and CS:GO, but I occasionally play other games based on community requests.
                    </p>
                  </div>
                  
                  <div className="border-b border-border pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="text-primary mr-2">Q:</span>
                      How can I play games with you?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      I host viewer games during specific streams, usually on weekends. Subscribers get priority, but I try to include everyone when possible!
                    </p>
                  </div>
                  
                  <div className="border-b border-border pb-4 last:border-b-0">
                    <h4 className="font-medium mb-2 flex items-center">
                      <span className="text-primary mr-2">Q:</span>
                      What are the channel subscription perks?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Subscribers get custom emotes, ad-free viewing, subscriber-only chat during certain events, priority for viewer games, and access to our Discord channels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
