
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface BusinessProductsTabProps {
  products: string[];
}

export function BusinessProductsTab({ products }: BusinessProductsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2">
          {products.map((product, index) => (
            <li key={index} className="text-lg">{product}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default BusinessProductsTab;
