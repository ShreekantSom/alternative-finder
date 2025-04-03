
import { Award, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Franchise {
  available: boolean;
  initialInvestment?: {
    min: number;
    max: number;
    currency: string;
  };
  fees?: {
    franchiseFee?: number;
    royaltyFee?: number;
    marketingFee?: number;
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Award className="mr-2 h-6 w-6 text-primary" />
          Franchise Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {franchise ? (
          <div className="space-y-6">
            <div className="flex items-center">
              <Badge variant={franchise.available ? "default" : "destructive"} className="text-md">
                {franchise.available ? 'Franchise Opportunities Available' : 'Not Available for Franchising'}
              </Badge>
            </div>
            
            {franchise.available && (
              <>
                {franchise.initialInvestment && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                      Initial Investment
                    </h3>
                    <p className="text-lg">
                      {formatCurrency(franchise.initialInvestment.min, franchise.initialInvestment.currency)} - {formatCurrency(franchise.initialInvestment.max, franchise.initialInvestment.currency)}
                    </p>
                  </div>
                )}
                
                {franchise.fees && Object.keys(franchise.fees).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Franchise Fees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {franchise.fees.franchiseFee !== undefined && (
                        <div className="bg-secondary/20 p-4 rounded-lg">
                          <p className="font-medium">Franchise Fee</p>
                          <p className="text-lg">{formatCurrency(franchise.fees.franchiseFee)}</p>
                        </div>
                      )}
                      
                      {franchise.fees.royaltyFee !== undefined && (
                        <div className="bg-secondary/20 p-4 rounded-lg">
                          <p className="font-medium">Royalty Fee</p>
                          <p className="text-lg">{franchise.fees.royaltyFee}%</p>
                        </div>
                      )}
                      
                      {franchise.fees.marketingFee !== undefined && (
                        <div className="bg-secondary/20 p-4 rounded-lg">
                          <p className="font-medium">Marketing Fee</p>
                          <p className="text-lg">{franchise.fees.marketingFee}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {franchise.requirements && franchise.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Franchise Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {franchise.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {franchise.support && franchise.support.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Franchisee Support</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {franchise.support.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    
                    {franchise.trainingProvided && (
                      <Badge variant="outline" className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Training Provided
                      </Badge>
                    )}
                  </div>
                )}
                
                {franchise.locations !== undefined && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Current Franchise Locations</h3>
                    <p className="text-lg">{franchise.locations}+ locations worldwide</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No franchise information available for this business.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BusinessFranchiseTab;
