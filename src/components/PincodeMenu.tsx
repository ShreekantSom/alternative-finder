
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "@/components/ui/menubar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PincodeMenuProps {
  className?: string;
}

export function PincodeMenu({ className }: PincodeMenuProps) {
  const [pincode, setPincode] = useState<string>("");
  const [savedPincode, setSavedPincode] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load saved pincode from localStorage on component mount
  useEffect(() => {
    const storedPincode = localStorage.getItem("userPincode");
    if (storedPincode) {
      setSavedPincode(storedPincode);
      setPincode(storedPincode);
    }
  }, []);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "");
    // Limit to 6 digits (standard for Indian pincodes)
    if (value.length <= 6) {
      setPincode(value);
    }
  };

  const savePincode = () => {
    if (pincode.length === 6) {
      localStorage.setItem("userPincode", pincode);
      setSavedPincode(pincode);
      toast({
        title: "Pincode Updated",
        description: `Your delivery location has been set to ${pincode}`,
      });
      
      // Refresh current page to update availability
      navigate(0);
    } else {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit pincode",
        variant: "destructive",
      });
    }
  };

  return (
    <Menubar className={className}>
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {savedPincode ? `Deliver to: ${savedPincode}` : "Set Delivery Location"}
        </MenubarTrigger>
        <MenubarContent className="w-56">
          <div className="p-2 space-y-2">
            <p className="text-sm font-medium">Enter your pincode</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="6-digit pincode"
                value={pincode}
                onChange={handlePincodeChange}
                className="flex-1"
              />
              <Button 
                onClick={savePincode}
                size="sm"
                variant="secondary"
              >
                Apply
              </Button>
            </div>
            {savedPincode && (
              <p className="text-xs text-muted-foreground mt-1">
                Currently set to: {savedPincode}
              </p>
            )}
          </div>
          <MenubarItem 
            className="justify-center font-medium cursor-pointer"
            onClick={() => { 
              navigator.geolocation.getCurrentPosition(
                () => {
                  toast({
                    title: "Location permission granted",
                    description: "We'll use your location to find your pincode",
                  });
                  // In a real app, this would use reverse geocoding to get pincode
                  // For demo purposes, we'll just show a message
                  setTimeout(() => {
                    setPincode("110001");
                    toast({
                      title: "Location Detected",
                      description: "Found pincode: 110001",
                    });
                  }, 1500);
                },
                () => {
                  toast({
                    title: "Location permission denied",
                    description: "Please enter your pincode manually",
                    variant: "destructive",
                  });
                }
              );
            }}
          >
            Use my current location
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default PincodeMenu;
