
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface BusinessServicesTabProps {
  services: string[];
}

export function BusinessServicesTab({ services }: BusinessServicesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {services.map((service, index) => (
            <li key={index} className="text-lg">{service}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default BusinessServicesTab;
