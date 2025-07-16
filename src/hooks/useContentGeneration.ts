import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AIService } from '@/services/aiService';
import { BrandPack } from '@/types/brand';
import { DELIVERABLE_TEMPLATES } from '@/constants/deliverables';
import { toast } from 'sonner';

export interface ContentGenerationParams {
  brandPack: BrandPack;
  templateId: string;
  title: string;
  description: string;
  additionalRequirements?: string;
}

export const useContentGeneration = () => {
  const { apiKey, model } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (params: ContentGenerationParams): Promise<string> => {
    if (!apiKey || !model) {
      throw new Error('Please configure your API settings first');
    }

    setIsGenerating(true);

    try {
      const template = DELIVERABLE_TEMPLATES.find(t => t.id === params.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      const aiService = new AIService({ apiKey, model });
      const htmlContent = await aiService.generateDeliverable({
        brandPack: params.brandPack,
        template,
        title: params.title,
        description: params.description,
        additionalRequirements: params.additionalRequirements
      });

      return htmlContent;
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    isGenerating
  };
};