import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  message: string;
  retryFn?: () => void;
}

export default function ErrorState({ message, retryFn }: ErrorStateProps) {
  return (
    <div className="w-full py-8 px-4">
      <Alert variant="destructive" className="max-w-lg mx-auto">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{message}</p>
          {retryFn && (
            <Button variant="outline" size="sm" onClick={retryFn}>
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
