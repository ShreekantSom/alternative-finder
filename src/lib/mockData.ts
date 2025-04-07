
import { Alternative } from "@/assets/data";

// Mock data for when Supabase fails or for development purposes
export const getMockAlternatives = (): Alternative[] => {
  return [
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
      name: "Grubhub",
      description: "Online food ordering and delivery marketplace",
      category: "Food Delivery",
      likes: 95,
      imageUrl: "/images/grubhub.png",
      url: "https://grubhub.com",
      pricing: "Paid",
      platform: ["Web", "iOS", "Android"]
    },
    {
      id: "4",
      name: "Postmates",
      description: "Delivery platform for food and other goods from local merchants",
      category: "Food Delivery",
      likes: 80,
      imageUrl: "/images/postmates.png",
      url: "https://postmates.com",
      pricing: "Paid",
      platform: ["Web", "iOS", "Android"]
    },
    {
      id: "5",
      name: "Uber",
      description: "Ridesharing platform connecting riders with drivers",
      category: "Ride Sharing",
      likes: 150,
      imageUrl: "/images/uber.png",
      url: "https://uber.com",
      pricing: "Paid",
      platform: ["Web", "iOS", "Android"]
    },
    {
      id: "6",
      name: "Lyft",
      description: "Ridesharing platform offering alternatives to traditional taxis",
      category: "Ride Sharing",
      likes: 125,
      imageUrl: "/images/lyft.png",
      url: "https://lyft.com",
      pricing: "Paid",
      platform: ["Web", "iOS", "Android"]
    },
    {
      id: "7",
      name: "Netflix",
      description: "Subscription streaming platform for movies and TV shows",
      category: "Streaming",
      likes: 180,
      imageUrl: "/images/netflix.png",
      url: "https://netflix.com",
      pricing: "Subscription",
      platform: ["Web", "iOS", "Android", "Smart TV"]
    },
    {
      id: "8",
      name: "Hulu",
      description: "Streaming platform with a mix of original and licensed content",
      category: "Streaming",
      likes: 120,
      imageUrl: "/images/hulu.png",
      url: "https://hulu.com",
      pricing: "Subscription",
      platform: ["Web", "iOS", "Android", "Smart TV"]
    }
  ];
};
