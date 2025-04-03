
import { Alternative } from '@/assets/data';
import { Store, MapPin, Truck, Smartphone } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface BusinessDetailsTabProps {
  business: Alternative;
}

export function BusinessDetailsTab({ business }: BusinessDetailsTabProps) {
  return (
    <div>
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Store className="mr-2 h-5 w-5 text-primary" />
              Business Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{business.businessType || 'Not specified'}</p>
            {business.establishedYear && (
              <p className="text-sm text-muted-foreground mt-1">Est. {business.establishedYear}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {business.physicalLocations && business.physicalLocations.length > 0 ? (
              <div className="space-y-2">
                {business.physicalLocations.map((location, index) => (
                  <div key={index} className="text-sm">
                    <p>{location.address}</p>
                    <p>{location.city}, {location.state} {location.zipCode}</p>
                    {index < business.physicalLocations!.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No physical locations</p>
            )}
            {business.businessType === 'Online Only' && <p className="mt-2 text-sm">Online presence only</p>}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Truck className="mr-2 h-5 w-5 text-primary" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {business.deliveryOptions && business.deliveryOptions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {business.deliveryOptions.map((option, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/20">
                    {option}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No delivery information available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {business.appLinks && Object.values(business.appLinks).some(link => !!link) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Smartphone className="mr-2 h-5 w-5 text-primary" />
              Available on
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {business.appLinks.playStore && (
                <a 
                  href={business.appLinks.playStore} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Google Play
                </a>
              )}
              {business.appLinks.appStore && (
                <a 
                  href={business.appLinks.appStore} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a9.96 9.96 0 0 1 6.29 2.23 10 10 0 0 1 3.66 5.47A9.93 9.93 0 0 1 22 12a9.96 9.96 0 0 1-2.23 6.29 10 10 0 0 1-5.47 3.66 9.93 9.93 0 0 1-2.3.05 10 10 0 0 1-6.25-2.97 10.11 10.11 0 0 1-3.45-6.55 10.07 10.07 0 0 1 .9-5.34 10 10 0 0 1 3.78-4.8A9.96 9.96 0 0 1 12 2Z" />
                  </svg>
                  App Store
                </a>
              )}
              {business.appLinks.chromeWebStore && (
                <a 
                  href={business.appLinks.chromeWebStore} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                  Chrome Web Store
                </a>
              )}
              {business.appLinks.tvOS && (
                <a 
                  href={business.appLinks.tvOS} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                    <polyline points="17 2 12 7 7 2" />
                  </svg>
                  TV OS App
                </a>
              )}
              {business.appLinks.amazonBrand && (
                <a 
                  href={business.appLinks.amazonBrand} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 11 8-9 8 9" />
                    <path d="M12 4v7.5" />
                    <path d="M9 9c0 9.13 2 13 8 13" />
                    <path d="M15 9c0 8-2 13-8 13" />
                  </svg>
                  Amazon Brand Page
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BusinessDetailsTab;
