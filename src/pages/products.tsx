import { useState, useEffect } from "react";
import { SidebarNav } from "../components/layout/sidebar-nav";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "../components/products/product-card";
import { ProductForm } from "../components/products/product-form";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import type { Product } from "../types";
import { Layout } from "../components/layout/layout";

export default function Products() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null); // State for filtered products

  // Fetch all products
  const { data: products, refetch } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    staleTime: 0,                 
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // This effect handles the API call with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 200); // Debounce delay

    return () => clearTimeout(timeoutId); // Cleanup on query change
  }, [searchQuery]);

  const fetchProducts = async (query: string) => {
    try {
      const url = query.trim()
        ? `/api/products/search?query=${encodeURIComponent(query)}`
        : `/api/products`; // Fetch all if input is empty

      const res = await fetch(url);
      const data = await res.json();
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
   
  
  // Handle search input change
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  return (
    <Layout>
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-14 border-b flex items-center justify-center relative">
            <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">
              Products
            </h1>
          </div>

          {/* Search Box */}
          <div className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="mb-6 flex items-center gap-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-2 border rounded-md"
              />
            </form>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {(filteredProducts || products)?.map((product) => (
                <ProductCard key={product.id} product={product} onActionComplete={() => fetchProducts(searchQuery)}/>
              ))}
            </div>
          </div>

          {/* Floating Add Product Button */}
          {user?.role === "admin" && (
            <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="fixed bottom-4 right-4 bg-primary text-white shadow-lg rounded-full p-4 md:p-3"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ProductForm
                onActionComplete={() => fetchProducts(searchQuery)}
              />
            </DialogContent>
          </Dialog>
          )}
        </main>
      </div>
    </Layout>
  );
}