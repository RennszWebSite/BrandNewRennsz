import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

export default function LoadingState({ message = "Loading...", fullscreen = false }: LoadingStateProps) {
  if (fullscreen) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 text-primary animate-spin mb-4">
          <Loader2 className="w-full h-full" />
        </div>
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 text-primary animate-spin mb-4">
        <Loader2 className="w-full h-full" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
