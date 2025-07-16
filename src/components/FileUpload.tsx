import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, FileText, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

type UrlForm = z.infer<typeof urlSchema>;

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onUrlSubmit, 
  disabled = false 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UrlForm>({
    resolver: zodResolver(urlSchema),
  });

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const onUrlFormSubmit = (data: UrlForm) => {
    onUrlSubmit(data.url);
    reset();
  };

  const supportedFormats = [
    'PDF documents',
    'Microsoft Office (DOCX, PPTX, XLSX)',
    'Google Docs links',
    'Website URLs',
    'Image files (PNG, JPG, GIF)',
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Brand Source</h2>
          <p className="text-muted-foreground">
            Upload a document or enter a website URL to generate your comprehensive brand pack
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload File</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>Website URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <p className="text-lg font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOCX, PPTX, XLSX, and image files
                  </p>
                </div>
              </Label>
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.pptx,.xlsx,.png,.jpg,.jpeg,.gif"
                onChange={handleFileChange}
                disabled={disabled}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <form onSubmit={handleSubmit(onUrlFormSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="flex items-center space-x-2">
                  <Link className="h-4 w-4" />
                  <span>Website or Document URL</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com or https://docs.google.com/..."
                  {...register('url')}
                  disabled={disabled}
                />
                {errors.url && (
                  <p className="text-sm text-destructive">{errors.url.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={disabled}>
                Analyze Website
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Supported Formats:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {supportedFormats.map((format, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                <span>{format}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};