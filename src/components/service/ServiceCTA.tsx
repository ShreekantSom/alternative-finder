
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceCTAProps {
  serviceName: string;
  serviceUrl: string;
}

export function ServiceCTA({ serviceName, serviceUrl }: ServiceCTAProps) {
  return (
    <Card className="mb-12 bg-gradient-to-r from-primary/10 to-primary/5 border-none">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Ready to try {serviceName}?</h2>
            <p className="text-muted-foreground">Visit the official website to learn more and get started.</p>
          </div>
          <a 
            href={serviceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-all"
          >
            Visit Website
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceCTA;
