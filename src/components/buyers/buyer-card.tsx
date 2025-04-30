import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
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
} from "../../components/ui/alert-dialog";
import { BuyerForm } from "./buyer-form";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import type { Buyer } from "../../types";

export function BuyerCard({ buyer }: { buyer: Buyer }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/buyers/${buyer.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/buyers"] });
      toast({
        title: "Buyer deleted",
        description: "The buyer has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete buyer",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Desktop Card View */}
      <div className="hidden md:block">
        <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.01]">
          <CardHeader className="space-y-0">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{buyer.name}</CardTitle>
              <div className="flex gap-2">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <BuyerForm buyer={buyer} onClose={() => setEditDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        buyer "{buyer.name}" and remove them from the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground flex justify-between">
              <span>{buyer.type.toUpperCase()}</span>
              <span>{buyer.town?.name}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Table View */}
      <div className="md:hidden">
        <div className="grid grid-cols-12 items-center gap-2 p-3 border-b hover:bg-gray-50">
          {/* Name (40%) */}
          <div className="col-span-4 font-medium truncate">
            {buyer.name}
          </div>
          
          {/* Type (20%) */}
          <div className="col-span-3 text-sm text-muted-foreground text-left">
            {buyer.type.toUpperCase()}
          </div>
          
          {/* Town (20%) */}
          <div className="col-span-3 text-sm text-muted-foreground truncate text-left">
            {buyer.town?.name || '-'}
          </div>
          
          {/* Actions (20%) - Dropdown for better mobile UX */}
          <div className="col-span-2 flex justify-end gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setEditDialogOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete buyer "{buyer.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
}