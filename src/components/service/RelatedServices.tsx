
import { Alternative } from '@/assets/data';
import AlternativesList from '@/components/AlternativesList';

interface RelatedServicesProps {
  services: Alternative[];
  isLoading: boolean;
  category: string;
}

export function RelatedServices({ services, isLoading, category }: RelatedServicesProps) {
  if (services.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Similar Services</h2>
      <AlternativesList 
        alternatives={services} 
        isLoading={isLoading} 
        selectedCategory={category}
      />
    </section>
  );
}

export default RelatedServices;
