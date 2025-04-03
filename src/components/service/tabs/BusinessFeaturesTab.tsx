
import { Check } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FeatureItem } from '@/assets/data';

interface BusinessFeaturesTabProps {
  features?: Array<string | FeatureItem>;
}

export function BusinessFeaturesTab({ features }: BusinessFeaturesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Key Features</CardTitle>
      </CardHeader>
      <CardContent>
        {features && features.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start p-4 border border-border rounded-lg">
                <div className="mr-4 p-2 bg-primary/10 rounded-full">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">
                    {typeof feature === 'string' ? feature : feature.name}
                  </h3>
                  {typeof feature !== 'string' && feature.description && (
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No features listed for this business.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default BusinessFeaturesTab;
