
// Sample data for D2C service providers
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
    url: 'https://www.instacart.com/'
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
    url: 'https://www.doordash.com/'
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
    url: 'https://www.uber.com/'
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
    url: 'https://www.netflix.com/'
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
    url: 'https://www.hellofresh.com/'
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
    url: 'https://www.spotify.com/'
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
  { id: '8', name: 'Fashion', icon: 'shirt', count: 29 }
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
  url: 'https://www.amazon.com/prime'
};
