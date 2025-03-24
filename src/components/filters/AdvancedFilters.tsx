
import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Filter,
  ChevronDown,
  DollarSign,
  MapPin,
  Leaf
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdvancedFiltersProps {
  onChange: (filters: {
    priceRange: number[];
    location: string;
    sustainability: boolean;
  }) => void;
}

export function AdvancedFilters({ onChange }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [location, setLocation] = useState<string>("All");
  const [sustainability, setSustainability] = useState<boolean>(false);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleApplyFilters = () => {
    onChange({
      priceRange,
      location,
      sustainability
    });
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setLocation("All");
    setSustainability(false);
    onChange({
      priceRange: [0, 1000],
      location: "All",
      sustainability: false
    });
  };

  return (
    <div className="mb-8">
      <Button
        onClick={toggleFilters}
        variant="outline"
        className="flex items-center space-x-2 mb-4"
      >
        <Filter className="w-4 h-4" />
        <span>Advanced Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-4 w-full"
      >
        <div className="p-6 bg-secondary/30 rounded-xl space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Label className="font-medium">Price Range</Label>
            </div>
            <div className="pt-2 px-2">
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={50}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex justify-between items-center">
                <div>
                  <Label htmlFor="min-price" className="text-xs">Min</Label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                    <Input
                      id="min-price"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-xs">Max</Label>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-3 w-3 mr-1 text-muted-foreground" />
                    <Input
                      id="max-price"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-20 h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <Label className="font-medium">Location</Label>
            </div>
            <div className="pt-2">
              <Input
                type="text"
                placeholder="Enter pincode or location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Sustainability Filter */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              <Label htmlFor="sustainability" className="font-medium">Sustainable/Eco-friendly Products</Label>
            </div>
            <Switch
              id="sustainability"
              checked={sustainability}
              onCheckedChange={setSustainability}
            />
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="default" 
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdvancedFilters;
