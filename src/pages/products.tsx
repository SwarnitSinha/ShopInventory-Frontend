import { useState, useEffect } from "react";
import { SidebarNav } from "../components/layout/sidebar-nav";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { ProductCard } from "../components/products/product-card";
import { ProductForm } from "../components/products/product-form";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import type { Product } from "../types";
import { Layout } from "../components/layout/layout";
import { apiRequest } from "../lib/queryClient"; // Import the apiRequest function
import { X, Search } from 'lucide-react';

export default function Products() {
  const { user } = useAuth();
  const [lowStock, setLowStock] = useState(false); // State to track low stock filter
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [products, setProducts] = useState<Product[] | null>(null); // State for products
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state


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

  // Filter products based on lowStock state
  const filteredProducts = lowStock
    ? products?.filter((product) => product.quantity < 10) // Show only low-stock products
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
          <div className="p-6">
            {/* Search Box and Low Stock Toggle */}
<div className="p-6">
  <form
    onSubmit={(e) => e.preventDefault()}
    className="mb-6 flex flex-col gap-3 sm:flex-row" // Stack vertically on small screens, horizontally on larger screens
  >
    {/* Search Input */}
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

    {/* Low Stock Toggle Button */}
    <button
      type="button"
      onClick={() => setLowStock((prev) => !prev)}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
        lowStock
          ? "bg-blue-500 text-white border-blue-700 shadow-lg"
          : "bg-white text-black border-gray-300 hover:bg-gray-100"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-sm border flex items-center justify-center ${
          lowStock ? "bg-white border-blue-500" : "bg-gray-200 border-gray-400"
        }`}
      >
        {lowStock && (
          <svg
            className="w-3 h-3 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span>Low Stock</span>
    </button>
  </form>
</div>

            {/* Loading and Error States */}
            {isLoading && <p>Loading products...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {lowStock && filteredProducts?.length === 0 && (
                <p className="text-gray-500">
                  No low-stock products found.
                </p>
              )}
              {!lowStock && filteredProducts?.length === 0 && (
                <p className="text-gray-500">
                  No products found.
                  <br />
                  Add your products!
                </p>
              )}
              {filteredProducts?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onActionComplete={() => fetchProducts(searchQuery)}
                />
              ))}
            </div>
          </div>

          {/* Floating Add Product Button */}
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
        </main>
      </div>
    </Layout>
  );
}