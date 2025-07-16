import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AIService } from '@/services/aiService';
import { BrandPack } from '@/types/brand';
import { DeliverableTemplate } from '@/constants/deliverables';
import { toast } from 'sonner';

export interface AIEnhancementParams {
  brandPack: BrandPack;
  fieldType: string;
  currentContent: string;
  template?: DeliverableTemplate;
}

export const useAIEnhancement = () => {
  const { apiKey, model } = useStore();
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceContent = async (params: AIEnhancementParams): Promise<string> => {
    if (!apiKey || !model) {
      throw new Error('Please configure your API settings first');
    }

    setIsEnhancing(true);

    try {
      const aiService = new AIService({ apiKey, model });
      const enhancedContent = await aiService.enhanceContent(params);
      
      toast.success('Content enhanced successfully!');
      return enhancedContent;
    } catch (error) {
      console.error('Content enhancement error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enhance content');
      throw error;
    } finally {
      setIsEnhancing(false);
    }
  };

  return {
    enhanceContent,
    isEnhancing
  };
};