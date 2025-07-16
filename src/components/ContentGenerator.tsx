import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BrandPack } from '@/types/brand';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import { FileText, Download, Loader2, Eye, Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DELIVERABLE_TEMPLATES } from '@/constants/deliverables';

const contentSchema = z.object({
  templateId: z.string().min(1, 'Please select a template'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  additionalRequirements: z.string().optional(),
});

type ContentForm = z.infer<typeof contentSchema>;

interface ContentGeneratorProps {
  brandPack: BrandPack;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ brandPack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { generateContent, isGenerating } = useContentGeneration();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
  });

  const watchedTemplate = watch('templateId');

  const selectedTemplateData = DELIVERABLE_TEMPLATES.find(t => t.id === watchedTemplate);

  const onSubmit = async (data: ContentForm) => {
    try {
      const content = await generateContent({
        brandPack,
        templateId: data.templateId,
        title: data.title,
        description: data.description,
        additionalRequirements: data.additionalRequirements,
      });
      setGeneratedContent(content);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const handleDownloadPDF = () => {
    if (generatedContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(generatedContent);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadHTML = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${watch('title')?.replace(/\s+/g, '_') || 'document'}.html`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const categories = [...new Set(DELIVERABLE_TEMPLATES.map(t => t.category))];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Content Generator</CardTitle>
                <p className="text-muted-foreground mt-1">
                  Create branded business deliverables using your brand pack
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: brandPack.colors.primary }}
              />
              <span>{brandPack.name}</span>
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Create New Deliverable</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-4">
                <Label htmlFor="templateId">Template Type</Label>
                <Select
                  value={watchedTemplate}
                  onValueChange={(value) => {
                    setValue('templateId', value);
                    setSelectedTemplate(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template type" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                          {category}
                        </div>
                        {DELIVERABLE_TEMPLATES
                          .filter(t => t.category === category)
                          .map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              <div className="flex items-center space-x-2">
                                <template.icon className="h-4 w-4" />
                                <span>{template.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        <Separator className="my-1" />
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                {errors.templateId && (
                  <p className="text-sm text-destructive">{errors.templateId.message}</p>
                )}
                
                {selectedTemplateData && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <selectedTemplateData.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{selectedTemplateData.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTemplateData.description}</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="Enter the title for your document"
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Content Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want to include in this document..."
                  className="min-h-[120px]"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <Label htmlFor="additionalRequirements">Additional Requirements (Optional)</Label>
                <Textarea
                  id="additionalRequirements"
                  placeholder="Any specific requirements, formatting preferences, or additional details..."
                  {...register('additionalRequirements')}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Deliverable
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
                    <Download className="h-4 w-4 mr-1" />
                    HTML
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!generatedContent ? (
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-border rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your generated content will appear here</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Fill out the form and click "Generate Deliverable" to get started
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-white p-4 max-h-96 overflow-y-auto">
                  <div 
                    dangerouslySetInnerHTML={{ __html: generatedContent }}
                    className="prose prose-sm max-w-none"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <p className="text-muted-foreground">
            Choose from our comprehensive collection of business document templates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="space-y-2">
                  {DELIVERABLE_TEMPLATES
                    .filter(t => t.category === category)
                    .map((template) => (
                      <div 
                        key={template.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                          selectedTemplate === template.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          setValue('templateId', template.id);
                          setSelectedTemplate(template.id);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <template.icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{template.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};