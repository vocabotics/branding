import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AIService } from '@/services/aiService';
import { BrandPack } from '@/types/brand';
import { toast } from 'sonner';

export interface ContentGenerationParams {
  brandPack: BrandPack;
  templateId: string;
  title: string;
  description: string;
  additionalRequirements?: string;
  targetAudience?: string;
  keyMessages?: string;
  callToAction?: string;
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
      const aiService = new AIService({ apiKey, model });
      const htmlContent = await aiService.generateContent(params);

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