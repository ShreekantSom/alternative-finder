

// Define the structure for alternatives (businesses)
export interface Alternative {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  pricing: "Freemium" | "Free" | "Paid" | "Subscription" | "Open Source";
  category: string;
  likes: number;
  platform: string[];
  availablePincodes?: string[];
}

// Define the structure for categories
export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

// Define feature item structure
export interface FeatureItem {
  name: string;
  description: string;
  iconName?: string;
}

// Sample data for alternatives/businesses
export const alternatives: Alternative[] = [
  {
    id: "1",
    name: "DoorDash",
    description: "Food delivery platform connecting customers with local restaurants",
    category: "Food Delivery",
    likes: 120,
    imageUrl: "/images/doordash.png",
    url: "https://doordash.com",
    pricing: "Paid",
    platform: ["Web", "iOS", "Android"]
  },
  {
    id: "2",
    name: "Uber Eats",
    description: "Food delivery platform by Uber with extensive restaurant partnerships",
    category: "Food Delivery",
    likes: 135,
    imageUrl: "/images/ubereats.png",
    url: "https://ubereats.com",
    pricing: "Paid",
    platform: ["Web", "iOS", "Android"]
  },
  {
    id: "3",
    name: "Netflix",
    description: "Subscription streaming platform for movies and TV shows",
    category: "Streaming",
    likes: 180,
    imageUrl: "/images/netflix.png",
    url: "https://netflix.com",
    pricing: "Subscription",
    platform: ["Web", "iOS", "Android", "Smart TV"]
  }
];

// Define a featured alternative
export const featuredAlternative: Alternative = {
  id: "1",
  name: "DoorDash",
  description: "Food delivery platform connecting customers with local restaurants",
  category: "Food Delivery",
  likes: 120,
  imageUrl: "/images/doordash.png",
  url: "https://doordash.com",
  pricing: "Paid",
  platform: ["Web", "iOS", "Android"]
};

// Export from this file to be used in other components
export const categories: Category[] = [
  { id: '1', name: 'Food Delivery', count: 12, icon: 'utensils' },
  { id: '2', name: 'Ride Sharing', count: 8, icon: 'car' },
  { id: '3', name: 'Streaming', count: 15, icon: 'film' },
  { id: '4', name: 'E-commerce', count: 20, icon: 'shopping-cart' },
  { id: '5', name: 'Fitness', count: 10, icon: 'dumbbell' },
  { id: '6', name: 'Finance', count: 14, icon: 'dollar-sign' },
  { id: '7', name: 'Productivity', count: 18, icon: 'calendar' },
  { id: '8', name: 'Home Services', count: 9, icon: 'home' },
];

