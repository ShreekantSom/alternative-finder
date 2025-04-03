
import { FeatureItem } from "@/assets/data";

interface FeatureDisplayProps {
  feature: string | FeatureItem;
}

export function FeatureDisplay({ feature }: FeatureDisplayProps) {
  if (typeof feature === 'string') {
    return <span>{feature}</span>;
  }
  
  return <span>{feature.name}</span>;
}

export default FeatureDisplay;
