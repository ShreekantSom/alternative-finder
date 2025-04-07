
import { Alternative } from '@/assets/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessDetailsTab from './tabs/BusinessDetailsTab';
import BusinessFeaturesTab from './tabs/BusinessFeaturesTab';
import BusinessFranchiseTab from './tabs/BusinessFranchiseTab';
import BusinessNewsTab, { NewsItem } from './tabs/BusinessNewsTab';
import BusinessProductsTab from './tabs/BusinessProductsTab';
import BusinessServicesTab from './tabs/BusinessServicesTab';

interface BusinessDetailTabsProps {
  business: Alternative;
}

export function BusinessDetailTabs({ business }: BusinessDetailTabsProps) {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Transform newsItems to match NewsItem interface if they exist
  const transformedNewsItems: NewsItem[] | undefined = business.newsItems?.map(item => ({
    id: item.id || `news-${Math.random().toString(36).substring(2, 11)}`,
    title: item.title,
    content: item.content || '',
    date: item.date,
    source: item.source,
    url: item.url,
    excerpt: item.excerpt,
    imageUrl: item.imageUrl
  }));

  // Transform franchise to match the updated Franchise interface
  const transformedFranchise = business.franchise ? {
    available: business.franchise.available,
    initialInvestment: business.franchise.initialInvestment ? {
      min: business.franchise.initialInvestment.min || 0,
      max: business.franchise.initialInvestment.max || 0,
      currency: business.franchise.initialInvestment.currency || 'USD'
    } : undefined,
    fees: {
      royalty: business.franchise.fees?.royaltyFee ? `${business.franchise.fees.royaltyFee}%` : undefined,
      marketing: business.franchise.fees?.marketingFee ? `${business.franchise.fees.marketingFee}%` : undefined,
      other: business.franchise.fees?.franchiseFee ? [`Franchise Fee: ${formatCurrency(business.franchise.fees.franchiseFee)}`] : undefined
    },
    requirements: business.franchise.requirements,
    locations: business.franchise.locations,
    support: business.franchise.support,
    trainingProvided: business.franchise.trainingProvided
  } : undefined;
  
  return (
    <Tabs defaultValue="details" className="mb-12">
      <TabsList className="grid grid-cols-4 md:grid-cols-6 mb-6">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="franchise">Franchise</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
        {business.products && business.products.length > 0 && (
          <TabsTrigger value="products">Products</TabsTrigger>
        )}
        {business.services && business.services.length > 0 && (
          <TabsTrigger value="services">Services</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="details">
        <BusinessDetailsTab business={business} />
      </TabsContent>
      
      <TabsContent value="features">
        <BusinessFeaturesTab features={business.features} />
      </TabsContent>
      
      <TabsContent value="franchise">
        <BusinessFranchiseTab franchise={transformedFranchise} formatCurrency={formatCurrency} />
      </TabsContent>
      
      <TabsContent value="news">
        <BusinessNewsTab newsItems={transformedNewsItems} />
      </TabsContent>
      
      {business.products && business.products.length > 0 && (
        <TabsContent value="products">
          <BusinessProductsTab products={business.products} />
        </TabsContent>
      )}
      
      {business.services && business.services.length > 0 && (
        <TabsContent value="services">
          <BusinessServicesTab services={business.services} />
        </TabsContent>
      )}
    </Tabs>
  );
}

export default BusinessDetailTabs;
