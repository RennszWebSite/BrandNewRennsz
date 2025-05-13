import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import { lazy, Suspense } from "react";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import NotFound from "@/pages/not-found";
import LoadingState from "./components/shared/LoadingState";

// Lazy load pages
const Home = lazy(() => import("@/pages/home"));
const AdminIndex = lazy(() => import("@/pages/admin/index"));
const AdminAnnouncements = lazy(() => import("@/pages/admin/announcements"));
const AdminSchedule = lazy(() => import("@/pages/admin/schedule"));
const AdminVideos = lazy(() => import("@/pages/admin/videos"));
const AdminAbout = lazy(() => import("@/pages/admin/about"));
const AdminSocialLinks = lazy(() => import("@/pages/admin/social-links"));
const AdminChannel = lazy(() => import("@/pages/admin/channel"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminIndex} />
      <Route path="/admin/announcements" component={AdminAnnouncements} />
      <Route path="/admin/schedule" component={AdminSchedule} />
      <Route path="/admin/videos" component={AdminVideos} />
      <Route path="/admin/about" component={AdminAbout} />
      <Route path="/admin/social-links" component={AdminSocialLinks} />
      <Route path="/admin/channel" component={AdminChannel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<LoadingState fullscreen />}>
                <Router />
              </Suspense>
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
