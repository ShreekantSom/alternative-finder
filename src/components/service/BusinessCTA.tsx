
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface BusinessCTAProps {
  businessName: string;
  businessUrl: string;
}

export function BusinessCTA({ businessName, businessUrl }: BusinessCTAProps) {
  return (
    <Card className="mb-12 bg-primary/5 border-2 border-primary/10">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-medium mb-2">Try {businessName} today</h3>
            <p className="text-muted-foreground">
              Visit the official website to learn more and get started with their services.
            </p>
          </div>
          <Button className="w-full md:w-auto" size="lg" asChild>
            <a href={businessUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Visit Official Site
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessCTA;
