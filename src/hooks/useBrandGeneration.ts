import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AIService } from '@/services/aiService';
import { ContentExtractor } from '@/services/contentExtractor';
import { BrandPack, ProcessingStatus } from '@/types/brand';
import { toast } from 'sonner';

export const useBrandGeneration = () => {
  const { 
    apiKey, 
    model, 
    setCurrentBrandPack, 
    setProcessingStatus, 
    addBrandPack 
  } = useStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const contentExtractor = new ContentExtractor();

  const updateStatus = (stage: ProcessingStatus['stage'], progress: number, message: string) => {
    setProcessingStatus({ stage, progress, message });
  };

  const generateFromUrl = async (url: string) => {
    if (!apiKey || !model) {
      toast.error('Please configure your API settings first');
      return;
    }

    setIsProcessing(true);
    
    try {
      updateStatus('extracting', 10, 'Extracting content from website...');
      
      const extractedContent = await contentExtractor.extractFromUrl(url);
      
      updateStatus('analyzing', 30, 'Analyzing content and visual elements...');
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      updateStatus('generating', 60, 'Generating comprehensive brand pack...');
      
      const aiService = new AIService({ apiKey, model });
      const brandPack = await aiService.processContent({
        content: `Title: ${extractedContent.title}\n\nDescription: ${extractedContent.description}\n\nContent: ${extractedContent.text}`,
        imageUrl: extractedContent.imageUrl,
        sourceType: 'website',
        sourceUrl: url
      });
      
      updateStatus('complete', 100, 'Brand pack generated successfully!');
      
      setCurrentBrandPack(brandPack);
      addBrandPack(brandPack);
      
      toast.success('Brand pack generated successfully!');
      
      // Clear status after a delay
      setTimeout(() => {
        setProcessingStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating from URL:', error);
      updateStatus('error', 0, error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to generate brand pack');
      
      setTimeout(() => {
        setProcessingStatus(null);
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateFromFile = async (file: File) => {
    if (!apiKey || !model) {
      toast.error('Please configure your API settings first');
      return;
    }

    setIsProcessing(true);
    
    try {
      updateStatus('uploading', 5, 'Uploading file...');
      
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload
      
      updateStatus('extracting', 20, 'Extracting content from file...');
      
      const extractedContent = await contentExtractor.extractFromFile(file);
      
      updateStatus('analyzing', 40, 'Analyzing content and visual elements...');
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      updateStatus('generating', 70, 'Generating comprehensive brand pack...');
      
      const aiService = new AIService({ apiKey, model });
      const brandPack = await aiService.processContent({
        content: `File: ${extractedContent.title}\n\nDescription: ${extractedContent.description}\n\nContent: ${extractedContent.text}`,
        imageUrl: extractedContent.imageUrl,
        sourceType: 'document',
        fileName: file.name
      });
      
      updateStatus('complete', 100, 'Brand pack generated successfully!');
      
      setCurrentBrandPack(brandPack);
      addBrandPack(brandPack);
      
      toast.success('Brand pack generated successfully!');
      
      // Clear status after a delay
      setTimeout(() => {
        setProcessingStatus(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating from file:', error);
      updateStatus('error', 0, error instanceof Error ? error.message : 'An error occurred');
      toast.error('Failed to generate brand pack');
      
      setTimeout(() => {
        setProcessingStatus(null);
      }, 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    generateFromUrl,
    generateFromFile,
    isProcessing
  };
};