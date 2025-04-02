
import { Facebook, Twitter, Linkedin, Share2, Link as LinkIcon, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { Alternative } from '@/assets/data';
import { useToast } from '@/components/ui/use-toast';

interface ServiceSocialLinksProps {
  service: Alternative;
}

export function ServiceSocialLinks({ service }: ServiceSocialLinksProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Create the share URLs
  const pageUrl = window.location.href;
  const shareText = `Check out ${service.name} - ${service.description.substring(0, 100)}...`;
  
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast({
      description: "Link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 3000);
  };
  
  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  const socialLinks = [
    {
      url: service.socialLinks?.facebook || null,
      Icon: Facebook,
      name: 'Facebook'
    },
    {
      url: service.socialLinks?.twitter || null,
      Icon: Twitter,
      name: 'Twitter'
    },
    {
      url: service.socialLinks?.linkedin || null,
      Icon: Linkedin,
      name: 'LinkedIn'
    }
  ].filter(link => link.url !== null);

  return (
    <div className="mt-6 mb-8">
      <h3 className="text-lg font-semibold mb-3">Connect & Share</h3>
      
      <div className="flex flex-wrap items-center gap-3">
        {socialLinks.length > 0 ? (
          <>
            <div className="flex items-center border-r border-border pr-3 mr-1">
              {socialLinks.map((socialLink, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={socialLink.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 mr-2"
                      >
                        <socialLink.Icon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visit {service.name} on {socialLink.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </>
        ) : null}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Share:</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9" 
                  onClick={() => openShareWindow(facebookUrl)}
                >
                  <Facebook className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share on Facebook</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9" 
                  onClick={() => openShareWindow(twitterUrl)}
                >
                  <Twitter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share on Twitter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9" 
                  onClick={() => openShareWindow(linkedinUrl)}
                >
                  <Linkedin className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share on LinkedIn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9" 
                  onClick={handleCopy}
                >
                  {copied ? <Copy className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? 'Copied!' : 'Copy link'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export default ServiceSocialLinks;
