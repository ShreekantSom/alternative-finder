
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Filter as FilterIcon,
  DollarSign,
  MapPin,
  Star,
  Save,
  Tags,
  Trash,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { softwareService } from '@/lib/softwareService';
import { categoryService } from '@/lib/categoryService';

// Define filters type
export interface FilterSettings {
  price: [number, number];
  rating: number;
  platforms: string[];
  categories: string[];
  tags: string[];
  location: string;
  features: string[];
  pricingModels: string[];
}

interface FilterPreset {
  id: string;
  name: string;
  filters: FilterSettings;
}

interface AdvancedFilterSystemProps {
  onFiltersChange: (filters: FilterSettings) => void;
  initialFilters?: Partial<FilterSettings>;
}

export function AdvancedFilterSystem({ onFiltersChange, initialFilters }: AdvancedFilterSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  // Current filters
  const [filters, setFilters] = useState<FilterSettings>({
    price: [0, 1000],
    rating: 0,
    platforms: [],
    categories: [],
    tags: [],
    location: '',
    features: [],
    pricingModels: [],
  });

  // Initialize filters with any initial values
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);

  // Fetch available tags, features, etc. on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch available tags
        const tagsResult = await softwareService.searchTagsAndSubcategories('');
        if (tagsResult.success && tagsResult.data) {
          setAvailableTags(tagsResult.data.tags.map(tag => tag.name));
        }

        // In a real application, you would fetch the available features
        setAvailableFeatures([
          'Free Trial',
          'Cloud-based',
          'Mobile App',
          'API Access',
          'Multi-language Support',
          'Offline Mode',
          'Data Export',
          'Custom Reports',
          'Team Collaboration',
          'Third-party Integrations'
        ]);

        // Load saved presets from localStorage
        const savedPresetsStr = localStorage.getItem('filterPresets');
        if (savedPresetsStr) {
          setSavedPresets(JSON.parse(savedPresetsStr));
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  const handleResetFilters = () => {
    setFilters({
      price: [0, 1000],
      rating: 0,
      platforms: [],
      categories: [],
      tags: [],
      location: '',
      features: [],
      pricingModels: [],
    });
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values."
    });
  };

  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your preset.",
        variant: "destructive"
      });
      return;
    }

    const newPreset: FilterPreset = {
      id: crypto.randomUUID(),
      name: newPresetName,
      filters: { ...filters }
    };

    const updatedPresets = [...savedPresets, newPreset];
    setSavedPresets(updatedPresets);
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
    
    setNewPresetName('');
    setIsSaveDialogOpen(false);
    
    toast({
      title: "Preset Saved",
      description: `Your filter preset "${newPresetName}" has been saved.`
    });
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    toast({
      title: "Preset Loaded",
      description: `Filter preset "${preset.name}" has been applied.`
    });
  };

  const handleDeletePreset = (presetId: string) => {
    const updatedPresets = savedPresets.filter(preset => preset.id !== presetId);
    setSavedPresets(updatedPresets);
    localStorage.setItem('filterPresets', JSON.stringify(updatedPresets));
    
    toast({
      title: "Preset Deleted",
      description: "Your filter preset has been deleted."
    });
  };

  const pricingOptions = [
    { id: 'free', label: 'Free' },
    { id: 'freemium', label: 'Freemium' },
    { id: 'paid', label: 'Paid' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'open-source', label: 'Open Source' },
  ];

  const platformOptions = [
    { id: 'web', label: 'Web' },
    { id: 'ios', label: 'iOS' },
    { id: 'android', label: 'Android' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'smart-tvs', label: 'Smart TVs' },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={toggleFilters}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <FilterIcon className="w-4 h-4" />
          <span>Advanced Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        
        {savedPresets.length > 0 && (
          <Select onValueChange={(value) => {
            const preset = savedPresets.find(p => p.id === value);
            if (preset) handleLoadPreset(preset);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Load saved filter" />
            </SelectTrigger>
            <SelectContent>
              {savedPresets.map(preset => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-4 w-full"
      >
        <Card className="p-6 space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {/* Price Range Filter */}
            <AccordionItem value="price">
              <AccordionTrigger className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Price Range</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2 px-2">
                  <Slider
                    value={filters.price}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={(val) => setFilters({...filters, price: [val[0], val[1]]})}
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
                          value={filters.price[0]}
                          onChange={(e) => setFilters({
                            ...filters, 
                            price: [parseInt(e.target.value), filters.price[1]]
                          })}
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
                          value={filters.price[1]}
                          onChange={(e) => setFilters({
                            ...filters, 
                            price: [filters.price[0], parseInt(e.target.value)]
                          })}
                          className="w-20 h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Location Filter */}
            <AccordionItem value="location">
              <AccordionTrigger className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Location / Availability</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <Input
                    type="text"
                    placeholder="Enter pincode or location"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Platforms Filter */}
            <AccordionItem value="platforms">
              <AccordionTrigger className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Platforms</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {platformOptions.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform.id}`}
                        checked={filters.platforms.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              platforms: [...filters.platforms, platform.id]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              platforms: filters.platforms.filter(p => p !== platform.id)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`platform-${platform.id}`}
                        className="text-sm font-normal"
                      >
                        {platform.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Pricing Models Filter */}
            <AccordionItem value="pricing">
              <AccordionTrigger className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Pricing Models</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {pricingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pricing-${option.id}`}
                        checked={filters.pricingModels.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              pricingModels: [...filters.pricingModels, option.id]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              pricingModels: filters.pricingModels.filter(p => p !== option.id)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`pricing-${option.id}`}
                        className="text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Tags Filter */}
            <AccordionItem value="tags">
              <AccordionTrigger className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-primary" />
                <span>Tags</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {availableTags.slice(0, 8).map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              tags: [...filters.tags, tag]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              tags: filters.tags.filter(t => t !== tag)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`tag-${tag}`}
                        className="text-sm font-normal"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Features Filter */}
            <AccordionItem value="features">
              <AccordionTrigger className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Features</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              features: [...filters.features, feature]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              features: filters.features.filter(f => f !== feature)
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={`feature-${feature}`}
                        className="text-sm font-normal"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Filter Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset All Filters
            </Button>
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="default" 
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Filter Preset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Preset</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="My custom filter"
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePreset}>
                    Save Preset
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Saved Presets */}
          {savedPresets.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Saved Presets</h3>
              <div className="space-y-2">
                {savedPresets.map(preset => (
                  <div key={preset.id} className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
                    <span className="text-sm">{preset.name}</span>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLoadPreset(preset)}
                        className="h-8 px-2"
                      >
                        Load
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePreset(preset.id)}
                        className="h-8 px-2 text-destructive"
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}

export default AdvancedFilterSystem;
