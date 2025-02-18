import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/products/product-card";
import { ProductForm } from "@/components/products/product-form";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types";

export default function Products() {
  const { user } = useAuth();
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-auto bg-background">
        <div className="h-14 border-b flex items-center justify-between px-4">
          <h1 className="text-lg font-medium">Products</h1>
          {user?.role === "admin" && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ProductForm />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
