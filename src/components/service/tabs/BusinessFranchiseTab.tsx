
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface Franchise {
  available: boolean;
  initialInvestment?: {
    min: number;
    max: number;
    currency: string;
  };
  fees?: {
    royalty?: string;
    marketing?: string;
    other?: string[];
  };
  requirements?: string[];
  locations?: number;
  support?: string[];
  trainingProvided?: boolean;
}

interface BusinessFranchiseTabProps {
  franchise?: Franchise;
  formatCurrency: (amount: number, currency?: string) => string;
}

export function BusinessFranchiseTab({ franchise, formatCurrency }: BusinessFranchiseTabProps) {
  if (!franchise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Franchise Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-amber-100 dark:bg-amber-900/20">
            <AlertCircle className="h-5 w-5 text-amber-800 dark:text-amber-500" />
            <AlertDescription className="text-amber-800 dark:text-amber-500">
              No franchise information is available for this business.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Franchise Information</CardTitle>
        <div className="flex items-center mt-2">
          <Badge variant={franchise.available ? "success" : "destructive"} className="rounded-md">
            {franchise.available ? 'Available for Franchising' : 'Not Available for Franchising'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!franchise.available ? (
          <Alert className="bg-gray-100 dark:bg-gray-900/20">
            <AlertDescription>
              This business is not currently offering franchise opportunities.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {franchise.initialInvestment && (
              <div>
                <h3 className="text-lg font-medium mb-3">Investment Required</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1">
                  <div className="p-4 rounded-md bg-primary/5 dark:bg-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">Minimum Investment</p>
                    <p className="text-2xl font-semibold">
                      {formatCurrency(franchise.initialInvestment.min, franchise.initialInvestment.currency)}
                    </p>
                  </div>
                  <div className="p-4 rounded-md bg-primary/5 dark:bg-primary/10">
                    <p className="text-sm text-muted-foreground mb-1">Maximum Investment</p>
                    <p className="text-2xl font-semibold">
                      {formatCurrency(franchise.initialInvestment.max, franchise.initialInvestment.currency)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {franchise.fees && (
              <div>
                <h3 className="text-lg font-medium mb-3">Ongoing Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {franchise.fees.royalty && (
                    <div className="p-4 rounded-md bg-secondary/20">
                      <p className="text-sm text-muted-foreground">Royalty Fee</p>
                      <p className="text-lg font-medium">{franchise.fees.royalty}</p>
                    </div>
                  )}
                  {franchise.fees.marketing && (
                    <div className="p-4 rounded-md bg-secondary/20">
                      <p className="text-sm text-muted-foreground">Marketing Fee</p>
                      <p className="text-lg font-medium">{franchise.fees.marketing}</p>
                    </div>
                  )}
                </div>
                
                {franchise.fees.other && franchise.fees.other.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-2">Other Fees</p>
                    <ul className="list-disc list-inside">
                      {franchise.fees.other.map((fee, index) => (
                        <li key={index} className="ml-2">{fee}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {franchise.requirements && franchise.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {franchise.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {franchise.locations !== undefined && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Locations</h3>
                  <p className="text-3xl font-semibold">{franchise.locations.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Franchises worldwide</p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-3">Training Provided</h3>
                {franchise.trainingProvided ? (
                  <div className="flex items-center">
                    <Check className="h-6 w-6 text-green-500 mr-2" />
                    <p className="text-lg">Training program available</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X className="h-6 w-6 text-red-500 mr-2" />
                    <p className="text-lg">No training program provided</p>
                  </div>
                )}
              </div>
            </div>
            
            {franchise.support && franchise.support.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Support Offered</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {franchise.support.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default BusinessFranchiseTab;
