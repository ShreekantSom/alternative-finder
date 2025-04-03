
import { Alternative as BaseAlternative } from '@/assets/data';

// Extend the Alternative type with company/business information
declare module '@/assets/data' {
  export interface FeatureItem {
    name: string;
    description: string;
    iconName?: string;
  }

  interface Alternative extends BaseAlternative {
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    features?: Array<string | FeatureItem>;
    performance?: number;
    support?: number;
    referralProgram?: {
      enabled: boolean;
      discountPercent?: number;
      referralCode?: string;
    };
    tags?: string[];
    businessType?: 'Physical Store' | 'Online Only' | 'Hybrid';
    physicalLocations?: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    }[];
    deliveryOptions?: ('Home Delivery' | 'Click & Collect' | 'In-Store Only')[];
    products?: string[];
    services?: string[];
    establishedYear?: number;
    pendingApproval?: boolean;
    submittedBy?: {
      id: string;
      type: 'user' | 'brand';
      date: string;
    };
    approvedBy?: {
      id: string;
      date: string;
    };
    subcategory?: string;
    newsItems?: {
      id: string;
      title: string;
      content: string;
      date: string;
      imageUrl?: string;
    }[];
    // Franchise information
    franchise?: {
      available: boolean;
      initialInvestment?: {
        min: number;
        max: number;
        currency: string;
      };
      fees?: {
        franchiseFee?: number;
        royaltyFee?: number; // Percentage
        marketingFee?: number; // Percentage
      };
      requirements?: string[];
      locations?: number; // Number of franchise locations
      support?: string[];
      trainingProvided?: boolean;
    };
    // App and store links
    appLinks?: {
      playStore?: string;
      appStore?: string;
      chromeWebStore?: string;
      tvOS?: string;
      amazonBrand?: string;
    };
    // External reviews
    externalReviews?: {
      source: string;
      rating: number;
      count: number;
      url: string;
      verified: boolean;
    }[];
  }
}
