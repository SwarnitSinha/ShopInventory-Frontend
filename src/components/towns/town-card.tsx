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
import { TownForm } from "./town-form";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import type { Town } from "../../types";

export function TownCard({ town }: { town: Town }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const canEdit = user?.role === "admin";
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest("DELETE", `/api/towns/${town.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
      toast({
        title: "Town deleted",
        description: "The town has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete town",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{town.name}</CardTitle>
          {canEdit && (
            <div className="flex gap-2">
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <TownForm town={town} onClose={() => setEditDialogOpen(false)} />
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      town "{town.name}" and remove them from the system.
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
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">District: {town.district}</p>
        {/* <p className="text-sm text-muted-foreground">Town: {town.town.name}</p> */}
      </CardContent>
    </Card>
  );
}