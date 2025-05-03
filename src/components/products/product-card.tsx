import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { PricingTable } from "./pricing-table";
import { Button } from "../../components/ui/button";
import { Edit, Trash2, IndianRupeeIcon, Loader2 } from "lucide-react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";


import { ProductForm } from "./product-form";
import { SellProductForm } from "./sell-product-form";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useToast } from "../../hooks/use-toast";
import type { Product } from "../../types";
import { useState } from "react";
import { API_BASE_URL } from "@/config";
import { getImageUrl } from "@/lib/utils";



export function ProductCard(
  { product,
    onActionComplete,
    viewMode,
    isMobile
  }
    :
    {
      product: Product;
      onActionComplete: () => void;
      viewMode: 'grid' | 'list';
      isMobile?: boolean;
    }) {
  console.log("ProductCard received product:", product); // Debugging
  console.log("Product ID:", product?.id); // Check if ID is undefined
  const { user } = useAuth();
  const { toast } = useToast();
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest("POST", `/api/products/delete/${String(product.id)}`);
      console.log("Delete button working " + `/api/products/delete/${String(product.id)}`);
      console.log(product.id);
      // queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      onActionComplete();
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
    <>
      {viewMode === 'grid' ? (
      // Remove the hidden md:block class to show on all screens
      <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.01] rounded-lg border border-gray-200 shadow-sm bg-white">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                title="Sell"
                onClick={() => window.location.href = "/bill-generate"}
                className="h-8 w-8"
              >
                <IndianRupeeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Edit"
                onClick={() => setEditDialogOpen(true)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                onClick={() => setDeleteDialogOpen(true)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="aspect-square w-full rounded-lg object-cover"
          />
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {product.quantity} in stock
            </span>
            <span className="text-sm font-medium">
              Cost: {"\u20B9"}{Number(product.purchasePrice).toFixed(0)}
            </span>
          </div>
          <PricingTable product={product} />
        </CardContent>
      </Card>
    ) : (
      <div className="w-full">
        <div className="grid grid-cols-12 gap-2 p-2 border-b hover:bg-gray-50 items-center">
        <div className="col-span-6">
  <div className="font-medium truncate">{product.name}</div>
  <div className="text-xs text-muted-foreground truncate mt-1">
    {product.description}
  </div>
</div>
          <div className="col-span-1 text-sm text-center">
            {product.quantity}
          </div>
          <div className="col-span-2 text-sm text-right">
            ₹{Number(product.purchasePrice).toFixed(0)}
          </div>
          <div className="col-span-3 flex justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Edit"
              onClick={() => setEditDialogOpen(true)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              onClick={() => setDeleteDialogOpen(true)}
              className="h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <ProductForm
            product={product}
            onClose={() => setEditDialogOpen(false)}
            onActionComplete={() => {
              onActionComplete();
              setEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{product.name}" from your inventory.
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
    </>
  );
}