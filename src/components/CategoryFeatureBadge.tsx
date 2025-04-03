
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { FeatureItem } from '@/assets/data';

interface CategoryFeatureBadgeProps {
  feature: string | FeatureItem;
}

export function CategoryFeatureBadge({ feature }: CategoryFeatureBadgeProps) {
  const displayText = typeof feature === 'string' ? feature : feature.name;
  
  return (
    <Badge variant="secondary" className="text-xs">
      {displayText}
    </Badge>
  );
}

export default CategoryFeatureBadge;
