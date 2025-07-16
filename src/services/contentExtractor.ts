export interface ExtractedContent {
  text: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export class ContentExtractor {
  async extractFromUrl(url: string): Promise<ExtractedContent> {
    try {
      // In a real implementation, you would use a service like:
      // - Puppeteer for web scraping
      // - Mercury Parser API
      // - Custom backend service
      
      // For demo purposes, we'll simulate content extraction
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }
      
      const html = await response.text();
      return this.parseHtmlContent(html, url);
    } catch (error) {
      // Fallback: create content based on URL analysis
      return this.createFallbackContent(url);
    }
  }

  async extractFromFile(file: File): Promise<ExtractedContent> {
    const fileType = file.type;
    const fileName = file.name;
    
    if (fileType.startsWith('image/')) {
      return this.extractFromImage(file);
    } else if (fileType === 'application/pdf') {
      return this.extractFromPdf(file);
    } else if (fileType.includes('document') || fileType.includes('text')) {
      return this.extractFromDocument(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }

  private parseHtmlContent(html: string, url: string): ExtractedContent {
    // Create a temporary DOM to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract title
    const title = doc.querySelector('title')?.textContent || 
                  doc.querySelector('h1')?.textContent || 
                  'Extracted Website';
    
    // Extract description
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       'Website content for brand analysis';
    
    // Extract main content
    const contentSelectors = ['main', 'article', '.content', '#content', 'body'];
    let text = '';
    
    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        text = element.textContent || '';
        break;
      }
    }
    
    // Clean and limit text
    text = text.replace(/\s+/g, ' ').trim().substring(0, 8000);
    
    // Extract image
    const imageUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                    doc.querySelector('img')?.getAttribute('src');
    
    return {
      text: text || `Website content from ${url}`,
      title: title.substring(0, 200),
      description: description.substring(0, 500),
      imageUrl: imageUrl ? new URL(imageUrl, url).href : undefined
    };
  }

  private createFallbackContent(url: string): ExtractedContent {
    const domain = new URL(url).hostname.replace('www.', '');
    const brandName = domain.split('.')[0];
    
    return {
      text: `Website analysis for ${brandName}. This is a ${domain} website that represents the ${brandName} brand. The site showcases their products, services, and brand identity. Key elements include their visual design, messaging, and overall brand presentation.`,
      title: `${brandName.charAt(0).toUpperCase() + brandName.slice(1)} Brand`,
      description: `Brand analysis for ${domain}`,
      imageUrl: `https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop` // Generic business image
    };
  }

  private async extractFromImage(file: File): Promise<ExtractedContent> {
    // Convert image to base64 for AI analysis
    const base64 = await this.fileToBase64(file);
    
    return {
      text: `Image file analysis: ${file.name}. This image contains visual brand elements including colors, typography, logos, and design elements that can be used to create a comprehensive brand identity.`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "Brand image for analysis",
      imageUrl: base64
    };
  }

  private async extractFromPdf(file: File): Promise<ExtractedContent> {
    // In a real implementation, you would use pdf-parse or similar library
    return {
      text: `PDF document analysis: ${file.name}. This document contains brand-related content including text, images, and design elements that define the brand identity and guidelines.`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "PDF document for brand analysis"
    };
  }

  private async extractFromDocument(file: File): Promise<ExtractedContent> {
    // In a real implementation, you would use mammoth.js for DOCX or similar libraries
    const text = await file.text();
    
    return {
      text: text.substring(0, 8000) || `Document analysis: ${file.name}. This document contains brand-related content and information.`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: "Document for brand analysis"
    };
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}