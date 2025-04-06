
import { Alternative } from "@/assets/data";

// Mock database of businesses
const businesses: Alternative[] = [
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
  },
  // Add more business examples as needed
];

export const businessService = {
  // Get all businesses
  getAllBusinesses: async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        data: businesses
      };
    } catch (error) {
      console.error("Error fetching businesses:", error);
      return {
        success: false,
        error: "Failed to fetch businesses"
      };
    }
  },
  
  // Get business by ID
  getBusinessById: async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const business = businesses.find(s => s.id === id);
      if (!business) {
        return {
          success: false,
          error: "Business not found"
        };
      }
      
      return {
        success: true,
        data: business
      };
    } catch (error) {
      console.error(`Error fetching business with ID ${id}:`, error);
      return {
        success: false,
        error: "Failed to fetch business details"
      };
    }
  },
  
  // Get businesses by category
  getBusinessesByCategory: async (category: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredBusinesses = businesses.filter(s => s.category === category);
      return {
        success: true,
        data: filteredBusinesses
      };
    } catch (error) {
      console.error(`Error fetching businesses for category ${category}:`, error);
      return {
        success: false,
        error: "Failed to fetch businesses by category"
      };
    }
  },
  
  // Search businesses by name or description
  searchBusinesses: async (query: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const normalizedQuery = query.toLowerCase();
      const results = businesses.filter(s => 
        s.name.toLowerCase().includes(normalizedQuery) || 
        s.description.toLowerCase().includes(normalizedQuery)
      );
      
      return {
        success: true,
        data: results
      };
    } catch (error) {
      console.error(`Error searching businesses with query ${query}:`, error);
      return {
        success: false,
        error: "Failed to search businesses"
      };
    }
  },
  
  // Add a new business
  createBusiness: async (business: Omit<Alternative, 'id'>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generate a new ID (in a real API, this would be done by the database)
      const newId = (businesses.length + 1).toString();
      
      const newBusiness: Alternative = {
        ...business,
        id: newId
      };
      
      // Add to mock database
      businesses.push(newBusiness);
      
      return {
        success: true,
        data: newBusiness
      };
    } catch (error) {
      console.error("Error creating business:", error);
      return {
        success: false,
        error: "Failed to create business"
      };
    }
  },
  
  // Update an existing business
  updateBusiness: async (id: string, updates: Partial<Alternative>) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const index = businesses.findIndex(s => s.id === id);
      if (index === -1) {
        return {
          success: false,
          error: "Business not found"
        };
      }
      
      // Update the business
      businesses[index] = {
        ...businesses[index],
        ...updates
      };
      
      return {
        success: true,
        data: businesses[index]
      };
    } catch (error) {
      console.error(`Error updating business with ID ${id}:`, error);
      return {
        success: false,
        error: "Failed to update business"
      };
    }
  },
  
  // Delete a business
  deleteBusiness: async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const index = businesses.findIndex(s => s.id === id);
      if (index === -1) {
        return {
          success: false,
          error: "Business not found"
        };
      }
      
      // Remove from mock database
      businesses.splice(index, 1);
      
      return {
        success: true,
        data: { id }
      };
    } catch (error) {
      console.error(`Error deleting business with ID ${id}:`, error);
      return {
        success: false,
        error: "Failed to delete business"
      };
    }
  }
};

export default businessService;
