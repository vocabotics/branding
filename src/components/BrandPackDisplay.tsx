import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandPack } from '@/types/brand';
import { Palette, Type, Eye, Target, FileImage } from 'lucide-react';

interface BrandPackDisplayProps {
  brandPack: BrandPack;
}

export const BrandPackDisplay: React.FC<BrandPackDisplayProps> = ({ brandPack }) => {
  const ColorSwatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg border">
      <div 
        className="w-12 h-12 rounded-lg border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground font-mono">{color}</p>
      </div>
    </div>
  );

  const FontDisplay: React.FC<{ font: string; label: string; sample: string }> = ({ font, label, sample }) => (
    <div className="p-4 border rounded-lg">
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <p className="font-medium text-sm mb-1">{font}</p>
      <p className="text-lg" style={{ fontFamily: font }}>{sample}</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{brandPack.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{brandPack.description}</p>
            </div>
            <Badge variant="outline">
              {brandPack.sourceType === 'website' ? 'Website' : 'Document'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="colors" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center space-x-2">
            <Type className="h-4 w-4" />
            <span>Typography</span>
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Vision</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Logo</span>
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center space-x-2">
            <FileImage className="h-4 w-4" />
            <span>Assets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColorSwatch color={brandPack.colors.primary} label="Primary" />
                <ColorSwatch color={brandPack.colors.secondary} label="Secondary" />
                <ColorSwatch color={brandPack.colors.accent} label="Accent" />
                <ColorSwatch color={brandPack.colors.neutral} label="Neutral" />
                <ColorSwatch color={brandPack.colors.background} label="Background" />
                <ColorSwatch color={brandPack.colors.text} label="Text" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FontDisplay 
                  font={brandPack.fonts.heading} 
                  label="Heading Font" 
                  sample="The Quick Brown Fox"
                />
                <FontDisplay 
                  font={brandPack.fonts.body} 
                  label="Body Font" 
                  sample="The quick brown fox jumps over the lazy dog."
                />
                <FontDisplay 
                  font={brandPack.fonts.accent} 
                  label="Accent Font" 
                  sample="Distinctive Style"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vision" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mission Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{brandPack.vision.mission}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vision Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{brandPack.vision.vision}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Core Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {brandPack.vision.values.map((value, index) => (
                    <Badge key={index} variant="secondary">{value}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Personality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {brandPack.vision.personality.map((trait, index) => (
                      <Badge key={index} variant="outline">{trait}</Badge>
                    ))}
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tone of Voice</p>
                    <p className="text-foreground">{brandPack.vision.tone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Primary Logo</h3>
                    <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/30">
                      <p className="text-muted-foreground">{brandPack.logo.primary}</p>
                    </div>
                  </div>
                  
                  {brandPack.logo.secondary && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Secondary Logo</h3>
                      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center bg-muted/30">
                        <p className="text-muted-foreground">{brandPack.logo.secondary}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Logo Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-line">{brandPack.assets.logoUsage}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Usage Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-line">{brandPack.assets.colorUsage}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-line">{brandPack.assets.typography}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagery Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-line">{brandPack.assets.imagery}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};