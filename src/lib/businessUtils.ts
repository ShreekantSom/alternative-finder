
// Helper utility functions for businessService

// Function to map pricing to valid values
export const mapPricing = (pricing: string): "Freemium" | "Free" | "Paid" | "Subscription" | "Open Source" => {
  const validPricings = ["Freemium", "Free", "Paid", "Subscription", "Open Source"];
  return validPricings.includes(pricing) ? pricing as any : "Freemium";
};

// Helper function to create URL-friendly slug from a string
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim();
};

// Fetch external reviews for a business
export const getExternalReviews = async (businessId: string) => {
  // In a real app, this would fetch from an API or scraping service
  // For demo purposes, we're returning mock data
  
  const mockReviews = [
    {
      source: "TrustPilot",
      rating: 4.5,
      count: 1247,
      url: "https://trustpilot.com",
      verified: true
    },
    {
      source: "Google Reviews",
      rating: 4.3,
      count: 853,
      url: "https://google.com",
      verified: true
    },
    {
      source: "Yelp",
      rating: 3.8,
      count: 412,
      url: "https://yelp.com",
      verified: false
    }
  ];
  
  // Simulate different reviews for different businesses
  const lastDigit = parseInt(businessId.slice(-1), 10);
  if (lastDigit % 3 === 0) {
    mockReviews[0].rating = 3.9;
    mockReviews[1].rating = 4.1;
  } else if (lastDigit % 3 === 1) {
    mockReviews[0].rating = 4.7;
    mockReviews[2].rating = 4.2;
  }
  
  return mockReviews;
};

// Transform database business to Alternative interface
export const transformBusinessToAlternative = (business: any) => {
  return {
    id: business.id,
    name: business.name,
    description: business.description,
    category: business.category_name,
    subcategory: business.subcategory,
    likes: business.reviews_count || 0,
    imageUrl: business.image_url || 'https://picsum.photos/200',
    url: business.website_url || 'https://example.com',
    pricing: mapPricing(business.pricing || 'Freemium'),
    platform: business.platform || ['Web'], // Default value
    availablePincodes: business.available_pincodes || [],
    tags: business.tags || []
  };
};
