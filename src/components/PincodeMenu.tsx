import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PincodeMenu() {
  const [open, setOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [userPincode, setUserPincode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load pincode from localStorage on component mount
    const storedPincode = localStorage.getItem("userPincode");
    if (storedPincode) {
      setUserPincode(storedPincode);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    
    // Store pincode in localStorage
    localStorage.setItem("userPincode", pincode);
    setUserPincode(pincode);
    setOpen(false); // Close the dialog
    setError(null); // Clear any previous errors
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {userPincode ? `Location: ${userPincode}` : "Set your location"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set Your Location</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your pincode to find businesses available in your area.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input 
              id="pincode"
              type="text" 
              placeholder="Enter pincode (e.g., 110001)" 
              value={pincode} 
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit">Save</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PincodeMenu;
