
import { Alternative } from '@/assets/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessDetailsTab from './tabs/BusinessDetailsTab';
import BusinessFeaturesTab from './tabs/BusinessFeaturesTab';
import BusinessFranchiseTab from './tabs/BusinessFranchiseTab';
import BusinessNewsTab from './tabs/BusinessNewsTab';
import BusinessProductsTab from './tabs/BusinessProductsTab';
import BusinessServicesTab from './tabs/BusinessServicesTab';

interface ServiceDetailTabsProps {
  business: Alternative;
}

export function ServiceDetailTabs({ business }: ServiceDetailTabsProps) {
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
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
        <BusinessFranchiseTab franchise={business.franchise} formatCurrency={formatCurrency} />
      </TabsContent>
      
      <TabsContent value="news">
        <BusinessNewsTab newsItems={business.newsItems} />
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

export default ServiceDetailTabs;
