
import { Alternative as BaseAlternative } from '@/assets/data';

// Extend the Alternative type with company/business information
declare module '@/assets/data' {
  interface Alternative extends BaseAlternative {
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    features?: string[];
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
  }
}
