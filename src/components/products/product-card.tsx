import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { PricingTable } from "./pricing-table";
import { Button } from "../../components/ui/button";
import { Edit, Trash2, DollarSign, Loader2 } from "lucide-react";
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
import { ProductForm } from "./product-form";
import { SellProductForm } from "./sell-product-form";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import type { Product } from "../../types";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  console.log("ProductCard received product:", product); // Debugging
  console.log("Product ID:", product?.id); // Check if ID is undefined
  const { user } = useAuth();
  const { toast } = useToast();
  const canSell = user?.role === "admin" || user?.role === "staff";
  const canEdit = user?.role === "admin";
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest("POST", `/api/products/delete/${String(product.id)}`);
      console.log("Delete button working "+ `/api/products/delete/${String(product.id)}`);
	  console.log(product.id);
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
  <CardHeader className="space-y-2"> {/* Added spacing between title and icons */}
    {/* Title */}
    <CardTitle className="text-lg">{product.name}</CardTitle>

    {/* Icons */}
    <div className="flex gap-2">
      {canSell && (
        <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <DollarSign className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SellProductForm 
              product={product} 
              onClose={() => setSellDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
      {canEdit && (
        <>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm 
                product={product} 
                onClose={() => setEditDialogOpen(false)} 
              />
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
                  product "{product.name}" and remove it from the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
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
        </>
      )}
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    <img
      src={product.imageUrl}
      alt={product.name}
      className="aspect-square w-full rounded-lg object-cover"
    />
    <p className="text-sm text-muted-foreground">{product.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">
        {product.quantity} in stock
      </span>
      {canEdit && (
        <span className="text-sm font-medium">
          Cost: ${Number(product.purchasePrice).toFixed(2)}
        </span>
      )}
    </div>
    <PricingTable product={product} />
  </CardContent>
</Card>
  );
}