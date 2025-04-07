
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Service {
  id: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
}

interface BusinessServicesTabProps {
  services: Service[];
}

export function BusinessServicesTab({ services }: BusinessServicesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div key={service.id} className="p-4 border rounded-md">
              <div className="flex items-start gap-3">
                {service.imageUrl && (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium text-lg">{service.name}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                  {service.price && (
                    <p className="text-sm font-medium mt-1">
                      {service.currency || "$"}{service.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessServicesTab;
