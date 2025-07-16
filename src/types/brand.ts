export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  background: string;
  text: string;
}

export interface BrandFonts {
  heading: string;
  body: string;
  accent: string;
}

export interface BrandLogo {
  primary: string;
  secondary?: string;
  icon?: string;
  wordmark?: string;
}

export interface BrandVision {
  mission: string;
  vision: string;
  values: string[];
  personality: string[];
  tone: string;
}

export interface BrandAssets {
  logoUsage: string;
  colorUsage: string;
  typography: string;
  imagery: string;
  spacing: string;
}

export interface BrandPack {
  id: string;
  name: string;
  description: string;
  colors: BrandColors;
  fonts: BrandFonts;
  logo: BrandLogo;
  vision: BrandVision;
  assets: BrandAssets;
  createdAt: Date;
  sourceType: 'website' | 'document';
  sourceUrl?: string;
  fileName?: string;
}

export interface ProcessingStatus {
  stage: 'uploading' | 'extracting' | 'analyzing' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
}