
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
}

interface BusinessProductsTabProps {
  products: Product[];
}

export function BusinessProductsTab({ products }: BusinessProductsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-md">
              <div className="flex items-start gap-3">
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-muted-foreground text-sm">{product.description}</p>
                  {product.price && (
                    <p className="text-sm font-medium mt-1">
                      {product.currency || "$"}{product.price}
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

export default BusinessProductsTab;
