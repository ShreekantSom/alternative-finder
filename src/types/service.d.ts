
import { Alternative as BaseAlternative } from '@/assets/data';

// Extend the Alternative type with social media links
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
  }
}
