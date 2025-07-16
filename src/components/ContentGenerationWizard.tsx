import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { BrandPack } from '@/types/brand';
import { useContentGeneration } from '@/hooks/useContentGeneration';
import { 
  FileText, 
  Download, 
  Loader2, 
  Eye, 
  Palette, 
  ArrowLeft, 
  ArrowRight, 
  Wand2,
  Sparkles,
  CheckCircle,
  Circle,
  Target,
  Type,
  Image as ImageIcon,
  Settings
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DELIVERABLE_TEMPLATES } from '@/constants/deliverables';
import { cn } from '@/lib/utils';
import { useAIEnhancement } from '@/hooks/useAIEnhancement';

const contentSchema = z.object({
  templateId: z.string().min(1, 'Please select a template'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  additionalRequirements: z.string().optional(),
  targetAudience: z.string().optional(),
  keyMessages: z.string().optional(),
  callToAction: z.string().optional(),
});

type ContentForm = z.infer<typeof contentSchema>;

interface ContentGenerationWizardProps {
  brandPack: BrandPack;
  onClose: () => void;
}

type WizardStep = 'template' | 'content' | 'details' | 'preview';

const WIZARD_STEPS = [
  { id: 'template', title: 'Choose Template', icon: Target },
  { id: 'content', title: 'Content Details', icon: Type },
  { id: 'details', title: 'Enhance & Refine', icon: Sparkles },
  { id: 'preview', title: 'Preview & Export', icon: Eye },
] as const;

export const ContentGenerationWizard: React.FC<ContentGenerationWizardProps> = ({ brandPack, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('template');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateContent } = useContentGeneration();
  const { enhanceContent, isEnhancing } = useAIEnhancement();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<ContentForm>({
    resolver: zodResolver(contentSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();
  const currentStepIndex = WIZARD_STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / WIZARD_STEPS.length) * 100;

  const selectedTemplate = DELIVERABLE_TEMPLATES.find(t => t.id === watchedValues.templateId);
  const categories = [...new Set(DELIVERABLE_TEMPLATES.map(t => t.category))];

  const canProceed = () => {
    switch (currentStep) {
      case 'template':
        return !!watchedValues.templateId;
      case 'content':
        return !!watchedValues.title && !!watchedValues.description && watchedValues.description.length >= 10;
      case 'details':
        return true; // Optional step
      case 'preview':
        return !!generatedContent;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const steps: WizardStep[] = ['template', 'content', 'details', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentStep === 'details' && !generatedContent) {
      // Generate content when moving from details to preview
      await generateDocument();
    } else if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps: WizardStep[] = ['template', 'content', 'details', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const generateDocument = async () => {
    const formData = getValues();
    setIsGenerating(true);
    
    try {
      const content = await generateContent({
        brandPack,
        templateId: formData.templateId,
        title: formData.title,
        description: formData.description,
        additionalRequirements: formData.additionalRequirements,
        targetAudience: formData.targetAudience,
        keyMessages: formData.keyMessages,
        callToAction: formData.callToAction,
      });
      setGeneratedContent(content);
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhanceField = async (fieldName: keyof ContentForm, currentValue: string) => {
    if (!currentValue.trim()) return;
    
    try {
      const enhanced = await enhanceContent({
        brandPack,
        fieldType: fieldName,
        currentContent: currentValue,
        template: selectedTemplate,
      });
      setValue(fieldName, enhanced);
    } catch (error) {
      console.error('Error enhancing content:', error);
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
      link.download = `${watchedValues.title?.replace(/\s+/g, '_') || 'document'}.html`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Content Creation Wizard</h2>
                <p className="text-muted-foreground">Create branded deliverables with AI assistance</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {WIZARD_STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            {WIZARD_STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isCompleted && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                    !isActive && !isCompleted && "bg-muted text-muted-foreground"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full overflow-y-auto">
            {/* Step 1: Template Selection */}
            {currentStep === 'template' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Choose Your Template</h3>
                  <p className="text-muted-foreground">Select the type of document you want to create</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <h4 className="font-semibold text-lg text-center">{category}</h4>
                      <div className="space-y-2">
                        {DELIVERABLE_TEMPLATES
                          .filter(t => t.category === category)
                          .map((template) => (
                            <Card 
                              key={template.id}
                              className={cn(
                                "cursor-pointer transition-all hover:shadow-md",
                                watchedValues.templateId === template.id && "ring-2 ring-primary bg-primary/5"
                              )}
                              onClick={() => setValue('templateId', template.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="p-2 bg-primary/10 rounded-lg">
                                    <template.icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium">{template.name}</h5>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {template.description}
                                    </p>
                                    <Badge variant="outline" className="mt-2">
                                      {template.format}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Content Details */}
            {currentStep === 'content' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <Type className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Content Details</h3>
                  <p className="text-muted-foreground">Provide the basic information for your document</p>
                </div>
                
                {selectedTemplate && (
                  <Card className="border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <selectedTemplate.icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{selectedTemplate.name}</h4>
                          <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title">Document Title *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('title', watchedValues.title || '')}
                        disabled={!watchedValues.title || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title for your document"
                      {...register('title')}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="description">Content Description *</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('description', watchedValues.description || '')}
                        disabled={!watchedValues.description || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
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
                </div>
              </div>
            )}

            {/* Step 3: Details & Enhancement */}
            {currentStep === 'details' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Enhance & Refine</h3>
                  <p className="text-muted-foreground">Add optional details to make your content even better</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('targetAudience', watchedValues.targetAudience || '')}
                        disabled={!watchedValues.targetAudience || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
                    <Input
                      id="targetAudience"
                      placeholder="Who is this document for? (e.g., potential clients, investors, employees)"
                      {...register('targetAudience')}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="keyMessages">Key Messages</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('keyMessages', watchedValues.keyMessages || '')}
                        disabled={!watchedValues.keyMessages || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
                    <Textarea
                      id="keyMessages"
                      placeholder="What are the main points you want to communicate?"
                      {...register('keyMessages')}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="callToAction">Call to Action</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('callToAction', watchedValues.callToAction || '')}
                        disabled={!watchedValues.callToAction || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
                    <Input
                      id="callToAction"
                      placeholder="What action should readers take? (e.g., contact us, visit website, schedule meeting)"
                      {...register('callToAction')}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEnhanceField('additionalRequirements', watchedValues.additionalRequirements || '')}
                        disabled={!watchedValues.additionalRequirements || isEnhancing}
                        className="text-primary hover:text-primary/80"
                      >
                        {isEnhancing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        <span className="ml-1">Enhance</span>
                      </Button>
                    </div>
                    <Textarea
                      id="additionalRequirements"
                      placeholder="Any specific formatting, style preferences, or additional details..."
                      {...register('additionalRequirements')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 'preview' && (
              <div className="space-y-6 h-full flex flex-col">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Preview & Export</h3>
                  <p className="text-muted-foreground">Review your generated document and export it</p>
                </div>
                
                {isGenerating ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                      <div>
                        <h4 className="text-lg font-semibold">Generating Your Document</h4>
                        <p className="text-muted-foreground">Creating branded content with AI...</p>
                      </div>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: brandPack.colors.primary }}
                          />
                          <span>{brandPack.name}</span>
                        </Badge>
                        {selectedTemplate && (
                          <Badge variant="secondary">
                            {selectedTemplate.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleDownloadHTML}>
                          <Download className="h-4 w-4 mr-2" />
                          HTML
                        </Button>
                        <Button onClick={handleDownloadPDF}>
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 border rounded-lg overflow-hidden bg-white">
                      <div className="h-full overflow-y-auto">
                        <div 
                          dangerouslySetInnerHTML={{ __html: generatedContent }}
                          className="h-full"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <h4 className="text-lg font-semibold">Ready to Generate</h4>
                        <p className="text-muted-foreground">Click "Generate Document" to create your content</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 'template'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {currentStep === 'details' && !generatedContent && (
                <Button
                  onClick={generateDocument}
                  disabled={!canProceed() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Document
                    </>
                  )}
                </Button>
              )}
              
              {currentStep !== 'preview' && (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              
              {currentStep === 'preview' && generatedContent && (
                <Button onClick={onClose}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};