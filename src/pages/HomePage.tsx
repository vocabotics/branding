import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SettingsDialog } from '@/components/SettingsDialog';
import { FileUpload } from '@/components/FileUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { BrandPackDisplay } from '@/components/BrandPackDisplay';
import { useBrandGeneration } from '@/hooks/useBrandGeneration';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Sparkles, Target, Zap } from 'lucide-react';
import { Toaster } from 'sonner';

export const HomePage: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { currentBrandPack, processingStatus, apiKey } = useStore();
  const { generateFromUrl, generateFromFile, isProcessing } = useBrandGeneration();

  const handleDownload = () => {
    if (currentBrandPack) {
      const dataStr = JSON.stringify(currentBrandPack, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentBrandPack.name.replace(/\s+/g, '_')}_brand_pack.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleNewBrandPack = () => {
    useStore.getState().setCurrentBrandPack(null);
    useStore.getState().setProcessingStatus(null);
  };

  const features = [
    {
      icon: Palette,
      title: "Comprehensive Color Palettes",
      description: "AI-generated color schemes that perfectly match your brand identity"
    },
    {
      icon: Target,
      title: "Professional Typography",
      description: "Curated font combinations for headings, body text, and accents"
    },
    {
      icon: Sparkles,
      title: "Brand Vision & Values",
      description: "Mission statements, core values, and brand personality traits"
    },
    {
      icon: Zap,
      title: "Usage Guidelines",
      description: "Detailed guidelines for consistent brand implementation"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSettingsClick={() => setShowSettings(true)} 
        onDownloadClick={currentBrandPack ? handleDownload : undefined}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!currentBrandPack && !processingStatus && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 brand-gradient opacity-20 blur-3xl rounded-full"></div>
                <div className="relative">
                  <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                    Create Professional
                    <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent"> Brand Packs </span>
                    with AI
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    Transform your website or documents into comprehensive brand identity packages. 
                    Get colors, typography, logos, and style guides powered by advanced AI.
                  </p>
                </div>
              </div>
              
              {!apiKey && (
                <div className="mb-8">
                  <Card className="max-w-2xl mx-auto border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
                    <CardContent className="p-4">
                      <p className="text-orange-800 dark:text-orange-200">
                        <strong>Get Started:</strong> Configure your OpenRouter API key in settings to begin generating brand packs.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSettings(true)}
                        className="mt-2"
                      >
                        Open Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-4">
                      <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Upload Section */}
            <div className="mb-12">
              <FileUpload 
                onFileSelect={generateFromFile}
                onUrlSubmit={generateFromUrl}
                disabled={isProcessing || !apiKey}
              />
            </div>

            {/* Sample Preview */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-6">See What You Get</h2>
              <div className="relative max-w-4xl mx-auto">
                <img 
                  src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=800&fit=crop&q=80"
                  alt="Brand pack preview"
                  className="rounded-lg shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Complete Brand Identity Package</h3>
                  <p className="text-white/90">Colors, typography, logos, guidelines, and more</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {processingStatus && (
          <ProcessingStatus status={processingStatus} />
        )}
        
        {currentBrandPack && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Your Brand Pack</h2>
              <Button onClick={handleNewBrandPack} variant="outline">
                Create New Brand Pack
              </Button>
            </div>
            <BrandPackDisplay brandPack={currentBrandPack} />
          </div>
        )}
      </main>
      
      <SettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
      
      <Toaster position="top-right" />
    </div>
  );
};