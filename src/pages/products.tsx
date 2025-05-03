import { useState, useEffect } from "react";
import { SidebarNav } from "../components/layout/sidebar-nav";
import { Button } from "../components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { ProductCard } from "../components/products/product-card";
import { ProductForm } from "../components/products/product-form";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import type { Product } from "../types";
import { Layout } from "../components/layout/layout";
import { apiRequest } from "../lib/queryClient"; // Import the apiRequest function
import { X, Search } from 'lucide-react';
import { LayoutGrid, List } from 'lucide-react';

export default function Products() {
  const { user } = useAuth();
  const [lowStock, setLowStock] = useState(false); // State to track low stock filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [products, setProducts] = useState<Product[] | null>(null); // State for products
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [addDialogOpen, setAddDialogOpen] = useState(false); // 👈 create a state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');


  // Parse query parameters from the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search); // Parse query string
    const filter = params.get("filter"); // Get the "filter" parameter
    if (filter === "low-stock") {
      setLowStock(true);
    } else {
      setLowStock(false);
    }
  }, []);


  // Fetch products on component mount or when searchQuery changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 200); // Debounce delay

    return () => clearTimeout(timeoutId); // Cleanup on query change
  }, [searchQuery]);

  // Add to your useEffect for initialization
  useEffect(() => {
    const savedViewMode = localStorage.getItem('productViewMode') as 'grid' | 'list' || 'grid';
    setViewMode(savedViewMode);
  }, []);

  // Function to fetch products
  const fetchProducts = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = query.trim()
        ? `/api/products/search?query=${encodeURIComponent(query)}`
        : `/api/products`; // Fetch all if input is empty

      const res = await apiRequest("GET", url);
      const data = await res.json(); // Parse the JSON response
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  // Add to your view mode toggle
  const toggleViewMode = () => {
    const newViewMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newViewMode);
    localStorage.setItem('productViewMode', newViewMode);
  };

  // Filter products based on lowStock state
  const filteredProducts = lowStock
    ? products?.filter((product) => product.quantity != null && product.quantity < 10)
    : products;



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
          <div className="p-2">
            {/* Search Box and Low Stock Toggle */}
            <div className="mb-6">
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Input - Takes full width on mobile */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {/* Button Group - Right-aligned and consistent height */}
                <div className="flex w-full sm:w-auto gap-2 sm:gap-3">
  {/* Low Stock Button - Takes remaining space on mobile */}
  <Button
    variant={lowStock ? "default" : "outline"}
    size="sm"
    onClick={() => setLowStock(!lowStock)}
    className="flex-1 sm:w-auto flex items-center justify-center gap-2 h-[38px] min-w-0"
  >
    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
      lowStock ? "bg-white border-white" : "bg-transparent border-current"
    }`}>
      {lowStock && (
        <svg className="w-2.5 h-2.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
    <span className="truncate">Low Stock</span>
  </Button>

  {/* View Toggle Button - Icon only on mobile (~10% width) */}
  <Button
  variant={viewMode === 'list' ? "default" : "outline"}
  size="sm"
  onClick={toggleViewMode}
  className="w-[38px] sm:w-auto flex items-center justify-center h-[38px] p-0 sm:px-3 sm:gap-2"
>
  <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-white' : 'text-current'}`} />
  <span className="hidden sm:inline">
    {viewMode === 'list' ? 'List' : 'Grid'}
  </span>
</Button>
</div>
              </form>
            </div>

            {/* Loading and Error States */}
            {isLoading && <p>Loading products...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Products Grid */}
            <div className="w-full">
              {(lowStock && filteredProducts?.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No low-stock products found</p>
                  <Button
                    variant="ghost"
                    onClick={() => setLowStock(false)}
                    className="mt-2"
                  >
                    Show all products
                  </Button>
                </div>
              )}
              {!lowStock && filteredProducts?.length === 0 && (
                <p className="text-gray-500">
                  No products found.
                  <br />
                  Add your products!
                </p>
              )}
              {/* Products Grid/List Container */}
              <div className={viewMode === 'grid' ?
                "grid gap-4 w-full sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
                "space-y-2 w-full"}>

                {/* Table Header for List View - Only show on desktop */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-12 gap-2 p-2 bg-gray-100 font-medium text-sm">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 text-center">Actions</div>
                  </div>
                )}

                {filteredProducts?.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onActionComplete={() => fetchProducts(searchQuery)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating Add Product Button */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
                onClose={() => setAddDialogOpen(false)}
                onActionComplete={() => {
                  fetchProducts(searchQuery)
                  setAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </Layout>


  );
}