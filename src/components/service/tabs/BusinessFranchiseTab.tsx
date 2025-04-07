
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export interface Franchise {
  available: boolean;
  initialInvestment?: {
    min: number;
    max: number;
    currency: string;
  };
  fees: {
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

export function BusinessFranchiseTab({ 
  franchise,
  formatCurrency
}: BusinessFranchiseTabProps) {
  if (!franchise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Franchise Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">No franchise information available for this business.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          Franchise Information
          <Badge variant={franchise.available ? "secondary" : "destructive"} className="ml-2">
            {franchise.available ? 'Available' : 'Not Available'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!franchise.available ? (
          <p className="text-muted-foreground">This business does not currently offer franchise opportunities.</p>
        ) : (
          <div className="space-y-6">
            {/* Investment Section */}
            {franchise.initialInvestment && (
              <div>
                <h3 className="text-lg font-medium mb-2">Initial Investment</h3>
                <p className="text-base font-semibold">
                  {formatCurrency(franchise.initialInvestment.min, franchise.initialInvestment.currency)} - {formatCurrency(franchise.initialInvestment.max, franchise.initialInvestment.currency)}
                </p>
              </div>
            )}
            
            {/* Fees Section */}
            {franchise.fees && (
              <div>
                <h3 className="text-lg font-medium mb-2">Ongoing Fees</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {franchise.fees.royalty && (
                    <li>Royalty Fee: {franchise.fees.royalty}</li>
                  )}
                  {franchise.fees.marketing && (
                    <li>Marketing Fee: {franchise.fees.marketing}</li>
                  )}
                  {franchise.fees.other && franchise.fees.other.map((fee, index) => (
                    <li key={index}>{fee}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Requirements Section */}
            {franchise.requirements && franchise.requirements.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {franchise.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Locations */}
            {franchise.locations !== undefined && (
              <div>
                <h3 className="text-lg font-medium mb-2">Current Franchise Locations</h3>
                <p>{franchise.locations.toLocaleString()} locations worldwide</p>
              </div>
            )}
            
            {/* Support */}
            {franchise.support && franchise.support.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Franchisee Support</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {franchise.support.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Training */}
            {franchise.trainingProvided !== undefined && (
              <div>
                <h3 className="text-lg font-medium mb-2">Training Program</h3>
                <div className="flex items-center">
                  {franchise.trainingProvided ? (
                    <>
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span>Comprehensive training program provided</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <span>No training program provided</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BusinessFranchiseTab;
