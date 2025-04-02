
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuthService } from "@/lib/auth";
import { CheckCircle, XCircle } from "lucide-react";

export function ApprovalManager() {
  const [pendingBrands, setPendingBrands] = useState<any[]>([]);
  const [pendingSuggestions, setPendingSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const brands = await AuthService.getPendingBrands();
      const suggestions = await AuthService.getPendingSuggestions();
      
      setPendingBrands(brands.filter((b: any) => b.status === 'pending'));
      setPendingSuggestions(suggestions.filter((s: any) => s.status === 'pending'));
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load pending submissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (submission: any) => {
    try {
      const result = await AuthService.approveBrand(submission.id);
      if (result.success) {
        toast({
          title: "Success",
          description: "Submission approved successfully",
        });
        loadSubmissions();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve submission",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error approving submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const openRejectDialog = (submission: any) => {
    setSelectedSubmission(submission);
    setRejectionReason("");
    setIsRejectionDialogOpen(true);
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await AuthService.rejectBrand(selectedSubmission.id, rejectionReason);
      if (result.success) {
        toast({
          title: "Success",
          description: "Submission rejected successfully",
        });
        setIsRejectionDialogOpen(false);
        loadSubmissions();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject submission",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const renderSubmissionCard = (submission: any, type: 'brand' | 'suggestion') => {
    return (
      <Card key={submission.id} className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{submission.name}</CardTitle>
              <CardDescription>
                Submitted {new Date(submission.submittedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge variant="outline">
              {type === 'brand' ? 'Brand Submission' : 'User Suggestion'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Description:</Label>
            <p className="text-sm mt-1">{submission.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Category:</Label>
              <p className="text-sm mt-1">{submission.category}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Pricing:</Label>
              <p className="text-sm mt-1">{submission.pricing}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Website URL:</Label>
            <p className="text-sm mt-1">
              <a 
                href={submission.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {submission.websiteUrl}
              </a>
            </p>
          </div>
          {submission.logoUrl && (
            <div>
              <Label className="text-sm font-medium">Logo:</Label>
              <div className="mt-2 h-16 w-16 overflow-hidden rounded border">
                <img 
                  src={submission.logoUrl} 
                  alt={`${submission.name} logo`}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
          )}
          {submission.tags && submission.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Tags:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {submission.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          {type === 'suggestion' && (
            <div>
              <Label className="text-sm font-medium">Suggested by:</Label>
              <p className="text-sm mt-1">User ID: {submission.userId}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => openRejectDialog(submission)}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
          <Button 
            onClick={() => handleApprove(submission)}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Approval Management</h2>
      
      <Tabs defaultValue="brands" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="brands">
            Brand Submissions ({pendingBrands.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            User Suggestions ({pendingSuggestions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands" className="mt-6">
          {isLoading ? (
            <p className="text-center py-8">Loading submissions...</p>
          ) : pendingBrands.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pending brand submissions</p>
          ) : (
            pendingBrands.map(brand => renderSubmissionCard(brand, 'brand'))
          )}
        </TabsContent>
        
        <TabsContent value="suggestions" className="mt-6">
          {isLoading ? (
            <p className="text-center py-8">Loading suggestions...</p>
          ) : pendingSuggestions.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pending user suggestions</p>
          ) : (
            pendingSuggestions.map(suggestion => renderSubmissionCard(suggestion, 'suggestion'))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission. This information will be visible to the submitter.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="reason">Rejection reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApprovalManager;
