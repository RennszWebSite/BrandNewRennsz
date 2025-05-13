import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";

interface ContentEditorProps {
  title: string;
  description: string;
  form: any;
  isEditing: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  children: ReactNode;
}

export default function ContentEditor({
  title,
  description,
  form,
  isEditing,
  isSubmitting,
  submitError,
  onSubmit,
  onCancel,
  children
}: ContentEditorProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Error alert */}
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {submitError}
                </AlertDescription>
              </Alert>
            )}

            {/* Form fields provided as children */}
            {children}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update" : "Create"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
