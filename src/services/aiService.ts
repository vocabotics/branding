import axios from 'axios';
import { BrandPack } from '@/types/brand';

interface AIServiceConfig {
  apiKey: string;
  model: string;
}

interface ProcessContentParams {
  content: string;
  imageUrl?: string;
  sourceType: 'website' | 'document';
  sourceUrl?: string;
  fileName?: string;
}

export class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  async processContent(params: ProcessContentParams): Promise<BrandPack> {
    const prompt = this.buildPrompt(params);
    
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          ...(params.imageUrl ? [{
            type: 'image_url',
            image_url: {
              url: params.imageUrl
            }
          }] : [])
        ]
      }
    ];

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.config.model,
          messages,
          max_tokens: 4000,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Brand Pack Generator'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      return this.parseBrandPackResponse(aiResponse, params);
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate brand pack. Please check your API settings and try again.');
    }
  }

  private buildPrompt(params: ProcessContentParams): string {
    return `
Analyze the following ${params.sourceType} content and create a comprehensive professional brand pack. 

Content to analyze:
${params.content}

Please create a complete brand identity package that includes:

1. Brand Name and Description
2. Color Palette (6 colors: primary, secondary, accent, neutral, background, text) - provide hex codes
3. Typography System (heading font, body font, accent font) - suggest real font names
4. Logo Concepts and Guidelines
5. Mission Statement
6. Vision Statement  
7. Core Values (3-5 values)
8. Brand Personality Traits (5-7 traits)
9. Tone of Voice Description
10. Detailed Usage Guidelines for:
    - Logo usage and placement
    - Color usage and combinations
    - Typography hierarchy and usage
    - Imagery style and guidelines
    - Spacing and layout principles

Respond ONLY with a JSON object in this exact format:
{
  "name": "Brand Name",
  "description": "Brief brand description",
  "colors": {
    "primary": "#hexcode",
    "secondary": "#hexcode", 
    "accent": "#hexcode",
    "neutral": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode"
  },
  "fonts": {
    "heading": "Font Name",
    "body": "Font Name",
    "accent": "Font Name"
  },
  "logo": {
    "primary": "Primary logo concept description",
    "secondary": "Secondary logo concept description",
    "icon": "Icon concept description",
    "wordmark": "Wordmark concept description"
  },
  "vision": {
    "mission": "Mission statement",
    "vision": "Vision statement", 
    "values": ["Value 1", "Value 2", "Value 3"],
    "personality": ["Trait 1", "Trait 2", "Trait 3"],
    "tone": "Tone of voice description"
  },
  "assets": {
    "logoUsage": "Detailed logo usage guidelines",
    "colorUsage": "Detailed color usage guidelines",
    "typography": "Detailed typography guidelines", 
    "imagery": "Detailed imagery guidelines",
    "spacing": "Detailed spacing and layout guidelines"
  }
}

Ensure all content is professional, comprehensive, and suitable for a complete brand identity system.`;
  }

  private parseBrandPackResponse(response: string, params: ProcessContentParams): BrandPack {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const brandData = JSON.parse(jsonMatch[0]);
      
      return {
        id: Date.now().toString(),
        name: brandData.name || 'Generated Brand',
        description: brandData.description || 'AI-generated brand identity',
        colors: brandData.colors || {
          primary: '#8b5cf6',
          secondary: '#06b6d4', 
          accent: '#f59e0b',
          neutral: '#6b7280',
          background: '#ffffff',
          text: '#1f2937'
        },
        fonts: brandData.fonts || {
          heading: 'Inter',
          body: 'Inter',
          accent: 'Inter'
        },
        logo: brandData.logo || {
          primary: 'Modern minimalist logo concept',
          secondary: 'Alternative logo variation'
        },
        vision: brandData.vision || {
          mission: 'Generated mission statement',
          vision: 'Generated vision statement',
          values: ['Innovation', 'Quality', 'Trust'],
          personality: ['Professional', 'Modern', 'Reliable'],
          tone: 'Professional and approachable'
        },
        assets: brandData.assets || {
          logoUsage: 'Logo usage guidelines',
          colorUsage: 'Color usage guidelines', 
          typography: 'Typography guidelines',
          imagery: 'Imagery guidelines',
          spacing: 'Spacing guidelines'
        },
        createdAt: new Date(),
        sourceType: params.sourceType,
        sourceUrl: params.sourceUrl,
        fileName: params.fileName
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  }
}