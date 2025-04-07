
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FolderPlus, Folder, Edit, Trash2, Grid2X2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Alternative } from "@/assets/data";

interface CollectionItem {
  id: string;
  business: Alternative;
  addedAt: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  items: CollectionItem[];
  createdAt: string;
  icon?: string;
}

export function UserCollections() {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "1",
      name: "Client Projects",
      description: "Businesses to recommend to clients",
      items: [
        {
          id: "item1",
          business: {
            id: "1",
            name: "DoorDash",
            description: "Food delivery platform",
            category: "Food Delivery",
            likes: 120,
            imageUrl: "/images/doordash.png",
            url: "https://doordash.com",
            pricing: "Paid",
            platform: ["Web", "iOS", "Android"]
          },
          addedAt: "2023-06-15T14:30:00Z"
        },
        {
          id: "item2",
          business: {
            id: "7",
            name: "Netflix",
            description: "Streaming platform",
            category: "Streaming",
            likes: 180,
            imageUrl: "/images/netflix.png",
            url: "https://netflix.com",
            pricing: "Subscription",
            platform: ["Web", "iOS", "Android", "Smart TV"]
          },
          addedAt: "2023-05-22T09:15:00Z"
        }
      ],
      createdAt: "2023-04-10T08:00:00Z",
      icon: "briefcase"
    },
    {
      id: "2",
      name: "Personal Use",
      description: "Apps and services for daily use",
      items: [
        {
          id: "item3",
          business: {
            id: "6",
            name: "Lyft",
            description: "Ridesharing platform",
            category: "Ride Sharing",
            likes: 125,
            imageUrl: "/images/lyft.png",
            url: "https://lyft.com",
            pricing: "Paid",
            platform: ["Web", "iOS", "Android"]
          },
          addedAt: "2023-06-20T16:45:00Z"
        }
      ],
      createdAt: "2023-05-15T11:30:00Z",
      icon: "home"
    }
  ]);
  
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: ""
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const handleCreateCollection = () => {
    if (!newCollection.name.trim()) {
      toast({
        title: "Error",
        description: "Collection name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newCol: Collection = {
      id: `collection-${Date.now()}`,
      name: newCollection.name,
      description: newCollection.description,
      items: [],
      createdAt: new Date().toISOString(),
      icon: "folder"
    };
    
    setCollections([...collections, newCol]);
    setNewCollection({ name: "", description: "" });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Collection "${newCollection.name}" created successfully`
    });
  };
  
  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter(col => col.id !== id));
    toast({
      title: "Success",
      description: "Collection deleted successfully"
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Collections</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <FolderPlus className="h-4 w-4" />
              <span>Create Collection</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="collection-name" className="text-sm font-medium">Collection Name</label>
                <Input 
                  id="collection-name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({...newCollection, name: e.target.value})}
                  placeholder="My Awesome Collection"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="collection-description" className="text-sm font-medium">Description (Optional)</label>
                <Input 
                  id="collection-description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({...newCollection, description: e.target.value})}
                  placeholder="A collection of businesses for a specific purpose"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCollection}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {collections.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <FolderPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">No Collections Yet</h3>
          <p className="text-muted-foreground mb-6">Create custom collections to organize businesses</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>Create Your First Collection</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <Card key={collection.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-md bg-primary/20 flex items-center justify-center">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{collection.name}</CardTitle>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => handleDeleteCollection(collection.id)}
                    title="Delete Collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mt-2">{collection.description}</p>
                )}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Created on {formatDate(collection.createdAt)}</span>
                  <span>{collection.items.length} items</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                {collection.items.length === 0 ? (
                  <div className="text-center py-8 flex-grow flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-3">
                      This collection is empty
                    </p>
                    <Button variant="outline" size="sm">Add Businesses</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collection.items.slice(0, 3).map(item => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden">
                          <img 
                            src={item.business.imageUrl} 
                            alt={item.business.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{item.business.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.business.category}</p>
                        </div>
                      </div>
                    ))}
                    
                    {collection.items.length > 3 && (
                      <div className="text-center mt-2">
                        <Button variant="link" size="sm">
                          View all {collection.items.length} items
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="mt-auto pt-4">
                  <Button variant="outline" className="w-full flex items-center justify-center" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    <span>Add to Collection</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="flex flex-col items-center justify-center h-full border-dashed border-2 cursor-pointer hover:bg-secondary/20 transition-colors min-h-[250px]">
            <Button 
              variant="ghost" 
              className="h-full w-full flex flex-col items-center justify-center p-6"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <FolderPlus className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Create New Collection</p>
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

export default UserCollections;
