import axios from 'axios';
import { BrandPack } from '@/types/brand';
import { DeliverableTemplate } from '@/constants/deliverables';
import { AIEnhancementParams } from '@/hooks/useAIEnhancement';

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

interface GenerateDeliverableParams {
  brandPack: BrandPack;
  templateId: string;
  title: string;
  description: string;
  additionalRequirements?: string;
  targetAudience?: string;
  keyMessages?: string;
  callToAction?: string;
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

  async generateContent(params: GenerateDeliverableParams): Promise<string> {
    const template = DELIVERABLE_TEMPLATES.find(t => t.id === params.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const prompt = this.buildDeliverablePrompt({ ...params, template });
    
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.config.model,
          messages,
          max_tokens: 6000,
          temperature: 0.3,
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
      return this.extractHtmlFromResponse(aiResponse);
    } catch (error) {
      console.error('Deliverable generation error:', error);
      throw new Error('Failed to generate deliverable. Please check your API settings and try again.');
    }
  }

  async enhanceContent(params: AIEnhancementParams): Promise<string> {
    const prompt = this.buildEnhancementPrompt(params);
    
    const messages = [
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: this.config.model,
          messages,
          max_tokens: 1000,
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
      return aiResponse.trim();
    } catch (error) {
      console.error('Content enhancement error:', error);
      throw new Error('Failed to enhance content. Please check your API settings and try again.');
    }
  }

  private buildEnhancementPrompt(params: AIEnhancementParams): string {
    const { brandPack, fieldType, currentContent, template } = params;
    
    const fieldInstructions = {
      title: 'Create a compelling, professional title that captures attention and clearly communicates the document\'s purpose.',
      description: 'Expand and improve this description to be more detailed, engaging, and comprehensive while maintaining clarity.',
      targetAudience: 'Refine and expand this target audience description to be more specific and detailed about who this document is for.',
      keyMessages: 'Enhance these key messages to be more impactful, clear, and aligned with the brand personality.',
      callToAction: 'Improve this call to action to be more compelling, specific, and action-oriented.',
      additionalRequirements: 'Enhance these requirements to be more detailed and specific about formatting, style, and content preferences.'
    };

    return `
You are enhancing content for a ${template?.name || 'business document'} using the following brand information:

BRAND CONTEXT:
Brand Name: ${brandPack.name}
Brand Description: ${brandPack.description}
Brand Personality: ${brandPack.vision.personality.join(', ')}
Tone of Voice: ${brandPack.vision.tone}
Core Values: ${brandPack.vision.values.join(', ')}

FIELD TYPE: ${fieldType}
CURRENT CONTENT: "${currentContent}"

TASK: ${fieldInstructions[fieldType as keyof typeof fieldInstructions] || 'Improve and enhance this content.'}

ENHANCEMENT GUIDELINES:
1. Maintain the brand's tone of voice (${brandPack.vision.tone})
2. Reflect the brand personality: ${brandPack.vision.personality.join(', ')}
3. Align with brand values: ${brandPack.vision.values.join(', ')}
4. Keep the enhanced content appropriate for the target document type
5. Make improvements that are meaningful and add value
6. Ensure the content remains professional and polished
7. Don't make it overly verbose - keep it concise but improved

Respond with ONLY the enhanced content, no explanations or additional text.`;
  }

  private buildDeliverablePrompt(params: GenerateDeliverableParams & { template: DeliverableTemplate }): string {
    const { brandPack, template, title, description, additionalRequirements, targetAudience, keyMessages, callToAction } = params;
    
    return `
Create a professional ${template.name} document using the provided brand pack. Generate complete HTML that can be saved as PDF.

BRAND PACK DETAILS:
Brand Name: ${brandPack.name}
Description: ${brandPack.description}

Colors:
- Primary: ${brandPack.colors.primary}
- Secondary: ${brandPack.colors.secondary}
- Accent: ${brandPack.colors.accent}
- Neutral: ${brandPack.colors.neutral}
- Background: ${brandPack.colors.background}
- Text: ${brandPack.colors.text}

Fonts:
- Heading: ${brandPack.fonts.heading}
- Body: ${brandPack.fonts.body}
- Accent: ${brandPack.fonts.accent}

Brand Vision:
- Mission: ${brandPack.vision.mission}
- Vision: ${brandPack.vision.vision}
- Values: ${brandPack.vision.values.join(', ')}
- Personality: ${brandPack.vision.personality.join(', ')}
- Tone: ${brandPack.vision.tone}

DOCUMENT REQUIREMENTS:
Template: ${template.name}
Title: ${title}
Description: ${description}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${keyMessages ? `Key Messages: ${keyMessages}` : ''}
${callToAction ? `Call to Action: ${callToAction}` : ''}
${additionalRequirements ? `Additional Requirements: ${additionalRequirements}` : ''}

Format: ${template.format}
Template Description: ${template.description}

GENERATE:
Create a complete, professional HTML document that:
1. Uses the brand colors consistently throughout
2. Implements the brand fonts (use web-safe fallbacks)
3. Reflects the brand personality and tone
4. Includes appropriate content based on the description
5. Is properly formatted for ${template.format} size
6. Includes CSS styles inline for PDF generation
7. Has professional layout and typography
8. Incorporates brand elements naturally
9. Addresses the target audience appropriately
10. Includes the key messages effectively
11. Features a compelling call to action

CSS REQUIREMENTS:
- Use @page CSS for print formatting
- Set appropriate margins and page size
- Ensure colors are print-friendly
- Use proper typography hierarchy
- Include responsive design principles

CONTENT GUIDELINES:
- Make content relevant to the template type
- Use the provided information to create realistic, detailed content
- Include professional details and information
- Maintain the brand tone (${brandPack.vision.tone}) throughout
- Ensure brand consistency
- Create engaging, valuable content that serves the document's purpose

Respond with ONLY the complete HTML document, no explanations or markdown formatting.`;
  }

  private extractHtmlFromResponse(response: string): string {
    // Try to extract HTML from the response
    const htmlMatch = response.match(/<!DOCTYPE html[\s\S]*<\/html>/i) || 
                     response.match(/<html[\s\S]*<\/html>/i) ||
                     response.match(/<div[\s\S]*<\/div>/i);
    
    if (htmlMatch) {
      return htmlMatch[0];
    }
    
    // If no complete HTML found, wrap the response in a basic HTML structure
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        @page { size: A4; margin: 1in; }
    </style>
</head>
<body>
${response}
</body>
</html>`;
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

// Import the DELIVERABLE_TEMPLATES
import { DELIVERABLE_TEMPLATES } from '@/constants/deliverables';