
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PincodeMenuProps {
  buttonClassName?: string;
}

export function PincodeMenu({ buttonClassName }: PincodeMenuProps) {
  const [open, setOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<string | null>(null);

  // List of available pincodes/locations
  const locations = [
    { value: '10001', label: 'New York - 10001' },
    { value: '90001', label: 'Los Angeles - 90001' },
    { value: '60601', label: 'Chicago - 60601' },
    { value: '75001', label: 'Dallas - 75001' },
    { value: '33101', label: 'Miami - 33101' },
    { value: '94101', label: 'San Francisco - 94101' },
    { value: '02101', label: 'Boston - 02101' },
    { value: '98101', label: 'Seattle - 98101' },
    { value: '30301', label: 'Atlanta - 30301' },
    { value: '80201', label: 'Denver - 80201' },
  ];

  // Load saved pincode from localStorage on component mount
  useEffect(() => {
    const savedPincode = localStorage.getItem('selected_pincode');
    if (savedPincode) {
      setSelectedPincode(savedPincode);
    }
  }, []);

  const handleSelectPincode = (currentValue: string) => {
    setSelectedPincode(currentValue);
    localStorage.setItem('selected_pincode', currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", buttonClassName)}
          size="sm"
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            {selectedPincode ? (
              locations.find((location) => location.value === selectedPincode)?.label
            ) : (
              "Set Your Location"
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[230px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty>No location found.</CommandEmpty>
          <CommandGroup>
            {locations.map((location) => (
              <CommandItem
                key={location.value}
                value={location.value}
                onSelect={(currentValue) => handleSelectPincode(currentValue)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPincode === location.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {location.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default PincodeMenu;
