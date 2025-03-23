
import { MapPin } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PincodeAlertProps {
  isAvailable: boolean | null;
  serviceName: string;
  userPincode: string | null;
}

export function PincodeAlert({ isAvailable, serviceName, userPincode }: PincodeAlertProps) {
  if (isAvailable === null || !userPincode) return null;

  return (
    <Alert className={`mb-6 ${isAvailable ? 'bg-green-50 text-green-800 border-green-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
      <MapPin className="h-4 w-4 mr-2" />
      <AlertDescription>
        {isAvailable 
          ? `${serviceName} is available in your area (${userPincode})` 
          : `${serviceName} is not currently available in your area (${userPincode})`}
      </AlertDescription>
    </Alert>
  );
}

export default PincodeAlert;
