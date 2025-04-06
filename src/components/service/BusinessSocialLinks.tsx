
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import { Alternative } from "@/assets/data";

interface BusinessSocialLinksProps {
  business: Alternative;
}

export function BusinessSocialLinks({ business }: BusinessSocialLinksProps) {
  // Check if the business has any social links defined
  const hasSocialLinks = business.socialLinks && Object.values(business.socialLinks).some(link => !!link);
  
  if (!hasSocialLinks) {
    return null;
  }
  
  return (
    <Card className="mb-12">
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-4">Find {business.name} on social media</h3>
        <div className="flex flex-wrap gap-3">
          {business.socialLinks?.facebook && (
            <SocialButton 
              href={business.socialLinks.facebook}
              icon={<Facebook className="h-5 w-5" />}
              label="Facebook"
              color="bg-blue-600 hover:bg-blue-700"
            />
          )}
          
          {business.socialLinks?.twitter && (
            <SocialButton 
              href={business.socialLinks.twitter}
              icon={<Twitter className="h-5 w-5" />}
              label="Twitter"
              color="bg-sky-500 hover:bg-sky-600"
            />
          )}
          
          {business.socialLinks?.instagram && (
            <SocialButton 
              href={business.socialLinks.instagram}
              icon={<Instagram className="h-5 w-5" />}
              label="Instagram"
              color="bg-pink-600 hover:bg-pink-700"
            />
          )}
          
          {business.socialLinks?.linkedin && (
            <SocialButton 
              href={business.socialLinks.linkedin}
              icon={<Linkedin className="h-5 w-5" />}
              label="LinkedIn"
              color="bg-blue-700 hover:bg-blue-800"
            />
          )}
          
          {business.socialLinks?.youtube && (
            <SocialButton 
              href={business.socialLinks.youtube}
              icon={<Youtube className="h-5 w-5" />}
              label="YouTube"
              color="bg-red-600 hover:bg-red-700"
            />
          )}
          
          {/* Replace website with a direct check on the business URL */}
          {business.url && (
            <SocialButton 
              href={business.url}
              icon={<Globe className="h-5 w-5" />}
              label="Website"
              color="bg-gray-600 hover:bg-gray-700"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SocialButton({ href, icon, label, color }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  color: string;
}) {
  return (
    <Button 
      variant="outline" 
      className={`${color} text-white border-none`}
      asChild
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        {icon}
        {label}
      </a>
    </Button>
  );
}

export default BusinessSocialLinks;
