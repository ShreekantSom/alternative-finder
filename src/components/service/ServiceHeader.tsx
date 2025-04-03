
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Tag, Store, Calendar, MapPin, Truck } from 'lucide-react';
import { Alternative } from '@/assets/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServiceHeaderProps {
  service: Alternative;
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  getPricingBgColor: (pricing: string) => string;
}

export function ServiceHeader({ 
  service, 
  isLiked, 
  onLike, 
  onShare, 
  getPricingBgColor 
}: ServiceHeaderProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Business image */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border/50 p-8 flex items-center justify-center">
        <img 
          src={service.imageUrl} 
          alt={service.name} 
          className="max-h-48 max-w-full object-contain"
        />
      </div>

      {/* Business info */}
      <div className="lg:col-span-2">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{service.name}</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={onLike}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-secondary text-muted-foreground'
                  }`}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={onShare}
                  className="p-2 rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag size={12} />
                {service.category}
              </Badge>
              <span className={`px-2 py-1 rounded-full text-xs ${getPricingBgColor(service.pricing)}`}>
                {service.pricing}
              </span>
              {service.businessType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Store size={12} />
                  {service.businessType}
                </Badge>
              )}
            </div>
            
            <p className="text-lg mb-6">{service.description}</p>
            
            <ServiceStats service={service} />
            
            <ServicePincodes service={service} />
          </div>
          
          <ServicePlatforms platforms={service.platform} />
        </div>
      </div>
    </div>
  );
}

function ServiceStats({ service }: { service: Alternative }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2 text-amber-500">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span><strong>{service.likes}</strong> likes</span>
      </div>
      {service.deliveryOptions?.includes('Home Delivery') && (
        <div className="flex items-center">
          <Truck className="w-5 h-5 mr-2 text-blue-500" />
          <span>Home delivery</span>
        </div>
      )}
      {service.establishedYear && (
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-500" />
          <span>Est. {service.establishedYear}</span>
        </div>
      )}
    </div>
  );
}

function ServicePincodes({ service }: { service: Alternative }) {
  if (!service.availablePincodes || service.availablePincodes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="font-medium mb-2 flex items-center gap-1.5">
        <MapPin className="h-4 w-4" />
        Available in pincodes:
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {service.availablePincodes.slice(0, 5).map((pin, index) => (
          <Badge key={index} variant="outline">{pin}</Badge>
        ))}
        {service.availablePincodes.length > 5 && (
          <Badge variant="outline">+{service.availablePincodes.length - 5} more</Badge>
        )}
      </div>
    </div>
  );
}

function ServicePlatforms({ platforms }: { platforms: string[] }) {
  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Available on:</h3>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {platform}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default ServiceHeader;
