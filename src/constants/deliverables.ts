import { 
  FileText, 
  Mail, 
  Presentation, 
  Image, 
  CreditCard, 
  Calendar,
  Users,
  TrendingUp,
  Award,
  Briefcase,
  Globe,
  MessageSquare,
  BookOpen,
  Target,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Newspaper,
  Gift,
  UserCheck
} from 'lucide-react';

export interface DeliverableTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  format: 'A4' | 'Letter' | 'Web' | 'Social' | 'Card';
}

export const DELIVERABLE_TEMPLATES: DeliverableTemplate[] = [
  // Corporate Documents
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    description: 'Professional proposal document with executive summary, project details, and pricing',
    category: 'Corporate Documents',
    icon: Briefcase,
    format: 'A4'
  },
  {
    id: 'letterhead',
    name: 'Company Letterhead',
    description: 'Official letterhead template with brand elements and contact information',
    category: 'Corporate Documents',
    icon: FileText,
    format: 'A4'
  },
  {
    id: 'invoice',
    name: 'Invoice Template',
    description: 'Professional invoice with itemized billing and payment terms',
    category: 'Corporate Documents',
    icon: DollarSign,
    format: 'A4'
  },
  {
    id: 'contract',
    name: 'Contract Template',
    description: 'Legal contract document with terms and conditions',
    category: 'Corporate Documents',
    icon: FileText,
    format: 'A4'
  },
  {
    id: 'report',
    name: 'Business Report',
    description: 'Comprehensive business report with charts, analysis, and recommendations',
    category: 'Corporate Documents',
    icon: BarChart3,
    format: 'A4'
  },

  // Marketing Materials
  {
    id: 'brochure',
    name: 'Company Brochure',
    description: 'Tri-fold brochure showcasing products, services, and company information',
    category: 'Marketing Materials',
    icon: Image,
    format: 'A4'
  },
  {
    id: 'flyer',
    name: 'Promotional Flyer',
    description: 'Eye-catching flyer for events, products, or services',
    category: 'Marketing Materials',
    icon: Newspaper,
    format: 'A4'
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Detailed case study showcasing client success stories and results',
    category: 'Marketing Materials',
    icon: Award,
    format: 'A4'
  },
  {
    id: 'white-paper',
    name: 'White Paper',
    description: 'Authoritative report on industry topics and thought leadership',
    category: 'Marketing Materials',
    icon: BookOpen,
    format: 'A4'
  },
  {
    id: 'product-sheet',
    name: 'Product Data Sheet',
    description: 'Technical specification and feature overview for products',
    category: 'Marketing Materials',
    icon: FileSpreadsheet,
    format: 'A4'
  },

  // Presentations
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    description: 'Investor pitch presentation with company overview and financials',
    category: 'Presentations',
    icon: Presentation,
    format: 'Web'
  },
  {
    id: 'company-overview',
    name: 'Company Overview',
    description: 'General company presentation for stakeholders and partners',
    category: 'Presentations',
    icon: Users,
    format: 'Web'
  },
  {
    id: 'sales-presentation',
    name: 'Sales Presentation',
    description: 'Product or service presentation for potential clients',
    category: 'Presentations',
    icon: TrendingUp,
    format: 'Web'
  },
  {
    id: 'training-slides',
    name: 'Training Presentation',
    description: 'Educational presentation for employee training and development',
    category: 'Presentations',
    icon: UserCheck,
    format: 'Web'
  },

  // Digital Assets
  {
    id: 'website-landing',
    name: 'Landing Page',
    description: 'Conversion-focused landing page for campaigns or products',
    category: 'Digital Assets',
    icon: Globe,
    format: 'Web'
  },
  {
    id: 'email-template',
    name: 'Email Newsletter',
    description: 'Branded email template for newsletters and campaigns',
    category: 'Digital Assets',
    icon: Mail,
    format: 'Web'
  },
  {
    id: 'social-media-post',
    name: 'Social Media Post',
    description: 'Branded social media post template for various platforms',
    category: 'Digital Assets',
    icon: MessageSquare,
    format: 'Social'
  },
  {
    id: 'banner-ad',
    name: 'Digital Banner',
    description: 'Web banner advertisement for online marketing campaigns',
    category: 'Digital Assets',
    icon: Image,
    format: 'Web'
  },

  // Business Cards & Stationery
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Professional business card with contact information and branding',
    category: 'Business Cards & Stationery',
    icon: CreditCard,
    format: 'Card'
  },
  {
    id: 'envelope',
    name: 'Branded Envelope',
    description: 'Company envelope with logo and return address',
    category: 'Business Cards & Stationery',
    icon: Mail,
    format: 'A4'
  },
  {
    id: 'notepad',
    name: 'Company Notepad',
    description: 'Branded notepad for internal use and client meetings',
    category: 'Business Cards & Stationery',
    icon: FileText,
    format: 'A4'
  },

  // Events & Certificates
  {
    id: 'event-invitation',
    name: 'Event Invitation',
    description: 'Formal invitation for corporate events and gatherings',
    category: 'Events & Certificates',
    icon: Calendar,
    format: 'A4'
  },
  {
    id: 'certificate',
    name: 'Achievement Certificate',
    description: 'Professional certificate template for awards and recognition',
    category: 'Events & Certificates',
    icon: Award,
    format: 'A4'
  },
  {
    id: 'agenda',
    name: 'Meeting Agenda',
    description: 'Structured agenda template for meetings and conferences',
    category: 'Events & Certificates',
    icon: Calendar,
    format: 'A4'
  },

  // Specialized Documents
  {
    id: 'press-release',
    name: 'Press Release',
    description: 'Media announcement template for news and updates',
    category: 'Specialized Documents',
    icon: Newspaper,
    format: 'A4'
  },
  {
    id: 'job-posting',
    name: 'Job Posting',
    description: 'Professional job description and requirements document',
    category: 'Specialized Documents',
    icon: Users,
    format: 'A4'
  },
  {
    id: 'survey-form',
    name: 'Survey Form',
    description: 'Customer feedback and market research survey template',
    category: 'Specialized Documents',
    icon: Target,
    format: 'A4'
  },
  {
    id: 'gift-certificate',
    name: 'Gift Certificate',
    description: 'Branded gift certificate for products or services',
    category: 'Specialized Documents',
    icon: Gift,
    format: 'A4'
  }
];