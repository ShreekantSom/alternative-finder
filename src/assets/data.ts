
// Sample data for companies/brands/businesses
export interface Alternative {
  id: string;
  name: string;
  description: string;
  category: string;
  likes: number;
  platform: string[];
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Subscription' | 'Open Source';
  imageUrl: string;
  url: string;
  availablePincodes?: string[]; 
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
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  tags?: string[];
  subcategory?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const alternatives: Alternative[] = [
  {
    id: '1',
    name: 'Instacart',
    description: 'Grocery delivery and pickup service with same-day delivery from local stores.',
    category: 'Quick Commerce',
    likes: 5425,
    platform: ['iOS', 'Android', 'Web'],
    pricing: 'Freemium',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Instacart_logo_and_wordmark.svg/2560px-Instacart_logo_and_wordmark.svg.png',
    url: 'https://www.instacart.com/',
    availablePincodes: ['110001', '110002', '400001', '400002'],
    businessType: 'Online Only',
    deliveryOptions: ['Home Delivery'],
    services: ['Grocery shopping', 'Same-day delivery', 'Store pickup'],
    socialLinks: {
      facebook: 'https://www.facebook.com/instacart',
      twitter: 'https://twitter.com/instacart',
      instagram: 'https://www.instagram.com/instacart'
    },
    tags: ['Fast Delivery', 'Local Stores', 'Grocery', 'Convenience'],
    subcategory: 'Grocery Delivery'
  },
  {
    id: '2',
    name: 'DoorDash',
    description: 'Food delivery service that connects customers with local restaurants and offers on-demand delivery.',
    category: 'Food Delivery',
    likes: 6829,
    platform: ['iOS', 'Android', 'Web'],
    pricing: 'Freemium',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/DoorDash_logo.svg/2560px-DoorDash_logo.svg.png',
    url: 'https://www.doordash.com/',
    availablePincodes: ['110001', '560001', '400001'],
    businessType: 'Online Only',
    deliveryOptions: ['Home Delivery'],
    services: ['Restaurant delivery', 'Grocery delivery', 'Convenience items'],
    socialLinks: {
      facebook: 'https://www.facebook.com/doordash',
      twitter: 'https://twitter.com/doordash',
      instagram: 'https://www.instagram.com/doordash'
    },
    tags: ['Fast Delivery', 'Restaurant Delivery', 'Wide Selection', 'Local Favorites'],
    subcategory: 'Restaurant Delivery'
  },
  {
    id: '3',
    name: 'Uber',
    description: 'Ride-hailing service that connects riders with drivers for on-demand transportation.',
    category: 'Ride-Sharing',
    likes: 7291,
    platform: ['iOS', 'Android', 'Web'],
    pricing: 'Paid',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Uber_App_Icon.svg/2048px-Uber_App_Icon.svg.png',
    url: 'https://www.uber.com/',
    availablePincodes: ['110001', '110002', '400001', '400002', '560001', '560002', '600001'],
    businessType: 'Hybrid',
    deliveryOptions: ['Home Delivery'],
    services: ['Ride-hailing', 'Food delivery', 'Package delivery'],
    physicalLocations: [
      {
        address: '1455 Market Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94103'
      }
    ],
    socialLinks: {
      facebook: 'https://www.facebook.com/uber',
      twitter: 'https://twitter.com/uber',
      linkedin: 'https://www.linkedin.com/company/uber-com/'
    },
    tags: ['Ride-Sharing', 'Transportation', 'Food Delivery', 'Global Service'],
    subcategory: 'Ride-Hailing'
  },
  {
    id: '4',
    name: 'Netflix',
    description: 'Subscription-based streaming service offering movies, TV shows, and original content.',
    category: 'Entertainment',
    likes: 9128,
    platform: ['iOS', 'Android', 'Web', 'Smart TVs'],
    pricing: 'Subscription',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1280px-Netflix_2015_logo.svg.png',
    url: 'https://www.netflix.com/',
    availablePincodes: ['110001', '110002', '400001', '400002', '560001', '560002', '600001', '700001'],
    businessType: 'Online Only',
    services: ['Streaming service', 'Original content production'],
    socialLinks: {
      facebook: 'https://www.facebook.com/netflix',
      twitter: 'https://twitter.com/netflix',
      instagram: 'https://www.instagram.com/netflix'
    },
    tags: ['Streaming', 'Original Content', 'Movies', 'TV Shows'],
    subcategory: 'Video Streaming'
  },
  {
    id: '5',
    name: 'HelloFresh',
    description: 'Meal kit delivery service that provides pre-portioned ingredients and recipes for home cooking.',
    category: 'Meal Kits',
    likes: 4239,
    platform: ['iOS', 'Android', 'Web'],
    pricing: 'Subscription',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/HelloFresh_company_logo.svg/2560px-HelloFresh_company_logo.svg.png',
    url: 'https://www.hellofresh.com/',
    availablePincodes: ['400001', '400002', '110001', '110002'],
    businessType: 'Online Only',
    deliveryOptions: ['Home Delivery'],
    products: ['Meal kits', 'Recipe cards', 'Pre-portioned ingredients'],
    socialLinks: {
      facebook: 'https://www.facebook.com/HelloFresh',
      instagram: 'https://www.instagram.com/hellofresh'
    },
    tags: ['Meal Kits', 'Fresh Ingredients', 'Easy Cooking', 'Subscription Box'],
    subcategory: 'Meal Plans'
  },
  {
    id: '6',
    name: 'Spotify',
    description: 'Digital music streaming service providing access to millions of songs, podcasts, and videos.',
    category: 'Entertainment',
    likes: 8127,
    platform: ['iOS', 'Android', 'Web', 'Desktop'],
    pricing: 'Freemium',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png',
    url: 'https://www.spotify.com/',
    availablePincodes: ['110001', '110002', '400001', '400002', '560001', '560002', '600001', '700001', '800001'],
    businessType: 'Online Only',
    services: ['Music streaming', 'Podcast hosting', 'Audio content creation'],
    socialLinks: {
      facebook: 'https://www.facebook.com/Spotify',
      twitter: 'https://twitter.com/spotify',
      instagram: 'https://www.instagram.com/spotify'
    },
    tags: ['Music Streaming', 'Podcasts', 'Playlists', 'Audio Content'],
    subcategory: 'Music Streaming'
  }
];

export const categories: Category[] = [
  { id: '1', name: 'Quick Commerce', icon: 'truck', count: 24 },
  { id: '2', name: 'Food Delivery', icon: 'utensils', count: 31 },
  { id: '3', name: 'Ride-Sharing', icon: 'car', count: 15 },
  { id: '4', name: 'Entertainment', icon: 'tv', count: 42 },
  { id: '5', name: 'Meal Kits', icon: 'package', count: 18 },
  { id: '6', name: 'Grocery', icon: 'shopping-basket', count: 27 },
  { id: '7', name: 'Health & Wellness', icon: 'heart', count: 35 },
  { id: '8', name: 'Fashion', icon: 'shirt', count: 29 },
  { id: '9', name: 'BFSI', icon: 'building-bank', count: 38 },
  { id: '10', name: 'Education', icon: 'book-open', count: 29 },
  { id: '11', name: 'Healthcare', icon: 'heart-pulse', count: 33 }
];

export const featuredAlternative: Alternative = {
  id: '7',
  name: 'Amazon Prime',
  description: 'Subscription service that provides members with free shipping, streaming video/music, and other benefits across various consumer categories.',
  category: 'Quick Commerce',
  likes: 9843,
  platform: ['iOS', 'Android', 'Web', 'Smart TVs'],
  pricing: 'Subscription',
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Amazon_Prime_Logo.svg/2560px-Amazon_Prime_Logo.svg.png',
  url: 'https://www.amazon.com/prime',
  availablePincodes: ['110001', '110002', '400001', '400002', '560001', '560002'],
  tags: ['Fast Shipping', 'Video Streaming', 'Music Streaming', 'Exclusive Deals'],
  subcategory: 'E-commerce Plus'
};
