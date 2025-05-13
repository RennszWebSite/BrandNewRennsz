import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export default function LoadingState({ message = "Loading...", fullscreen = false, className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${fullscreen ? 'min-h-screen' : ''} ${className}`}>
      <div className="w-10 h-10 text-primary animate-spin mb-4">
        <Loader2 className="w-full h-full" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}