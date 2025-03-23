import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import type { Sale } from "../types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Layout } from "../components/layout/layout";
import { Invoice } from "../components/products/invoice";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { SellProductForm } from "../components/products/sell-product-form";
import { apiRequest, queryClient } from "../lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../components/ui/dialog";

export default function Sales() {
  const [filters, setFilters] = useState({
    buyer: "",
    product: "",
    town: "",
    startDate: "",
    endDate: "",
  }); // State for filters
  const [sales, setSales] = useState<Sale[]>([]); // State for sales data
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null); // State for selected sale
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false); // State for update dialog visibility

  // Fetch sales based on filters
  // Fetch all sales (initial load or reset)
  async function fetchInitialSales() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/sales");
      if (!response.ok) {
        throw new Error("Failed to fetch initial sales");
      }
      const data = await response.json();
      const mappedSales = data.map((sale: any) => ({
        ...sale,
        id: sale._id, // Map `_id` to `id`
        buyer: {
          ...sale.buyer,
          id: sale.buyer._id, // Map buyer `_id` to `id`
        },
        product: {
          ...sale.product,
          id: sale.product._id, // Map product `_id` to `id`
        },
      }));
      setSales(mappedSales);
    } catch (error) {
      console.error("Failed to fetch initial sales:", error);
      alert("Failed to load initial sales data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchSales() {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>);
      const response = await fetch(`/api/sales/filter?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }
      const data = await response.json();
      // Map the API response to match the `Sale` type
    const mappedSales = data.map((sale: any) => ({
      ...sale,
      id: sale._id, // Map `_id` to `id`
      buyer: {
        ...sale.buyer,
        id: sale.buyer._id, // Map buyer `_id` to `id`
      },
      product: {
        ...sale.product,
        id: sale.product._id, // Map product `_id` to `id`
      },
    }));

    setSales(mappedSales);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      alert("Failed to fetch sales. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch initial sales data when the component mounts
  useEffect(() => {
    fetchInitialSales();
  }, []); // Empty dependency array ensures this runs only once

  function resetFilters() {
    setFilters({
      buyer: "",
      product: "",
      town: "",
      startDate: "",
      endDate: "",
    });
    fetchInitialSales();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleInvoiceClick(sale: Sale) {
    setSelectedSale(sale); // Set the selected sale
    setIsModalOpen(true); // Open the modal
  }

  function closeModal() {
    setIsModalOpen(false); // Close the modal
    setSelectedSale(null); // Clear the selected sale
  }

  function handleUpdateClick(sale: Sale) {
    console.log("Selected Sale for Update:", sale);
    setSelectedSale(sale); // Set the selected sale
    setUpdateDialogOpen(true); // Open the update dialog
  }

  function closeUpdateDialog() {
    setUpdateDialogOpen(false); // Close the update dialog
    setSelectedSale(null); // Clear the selected sale
  }

  async function handleDeleteClick(sale: Sale) {
    console.log("SALE ID : ",sale.id)
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await apiRequest("DELETE", "/api/sales/delete", sale);
        if (!response.ok) {
          throw new Error("Failed to delete sale");
        }
        alert("Sale deleted successfully");
        fetchSales(); // Refresh the sales table
      } catch (error) {
        console.error("Failed to delete sale:", error);
        alert("Failed to delete sale. Please try again.");
      }
    }
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col">
        {/* Filter Section */}
        <div className="p-4 bg-gray-100 border-b">
          <h2 className="text-lg font-medium mb-4">Search Sales</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Buyer Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Buyer</label>
              <Input
                type="text"
                name="buyer"
                value={filters.buyer}
                onChange={handleInputChange}
                placeholder="Enter buyer name"
              />
            </div>

            {/* Product Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <Input
                type="text"
                name="product"
                value={filters.product}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <Input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleInputChange}
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <Input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
  <Button onClick={resetFilters} className="w-full md:w-auto bg-gray-500 hover:bg-gray-600">
    Reset
  </Button>
  <Button onClick={fetchSales} className="w-full md:w-auto">
    Search
  </Button>
</div>
        </div>

        {/* Sales Table */}
        <div className="p-6 flex-1 overflow-auto">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Amount Dues</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
  {sales.length === 0 ? (
    <TableRow>
      <TableCell colSpan={8} className="text-center text-gray-500">
        No records found.
      </TableCell>
    </TableRow>
  ) : (
    sales.map((sale) => (
      <TableRow
        key={sale.id}
        className={sale.status === "due" ? "bg-red-50" : "bg-green-50"}
      >
        <TableCell>{sale.buyer?.name}</TableCell>
        <TableCell>{sale.product?.name}</TableCell>
        <TableCell>{sale.quantity}</TableCell>
        <TableCell className="text-right">
          ${Number(sale.totalAmount).toFixed(2)}
        </TableCell>
        <TableCell>${Number(sale.amountPaid).toFixed(2)}</TableCell>
        <TableCell>${(sale.totalAmount - sale.amountPaid).toFixed(2)}</TableCell>
        <TableCell>
          {format(new Date(sale.saleDate), "MMM d, yyyy")}
        </TableCell>
        <TableCell className="text-right flex gap-2">
          {/* Invoice Button */}
          <button
            className="px-2 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => handleInvoiceClick(sale)}
          >
            Invoice
          </button>

          {/* Update Button */}
          <button
            className="px-2 py-1 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
            onClick={() => handleUpdateClick(sale)}
          >
            Update
          </button>

          {/* Delete Button */}
          <button
            className="px-2 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleDeleteClick(sale)}
          >
            Delete
          </button>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal for Invoice */}
      {isModalOpen && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-2/3 max-w-3xl h-auto max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <Invoice sale={selectedSale} product={selectedSale.product} />
          </div>
        </div>
      )}

{updateDialogOpen && selectedSale && (
  <Dialog open={updateDialogOpen} onOpenChange={closeUpdateDialog}>
    <DialogContent>
    <SellProductForm
  product={{
    ...selectedSale.product,
    id: selectedSale.product._id, // Map `_id` to `id`
    purchasePrice: String(selectedSale.product.purchasePrice), // Convert to string
    regularPrice: String(selectedSale.product.regularPrice), // Convert to string
    bulkPrice: String(selectedSale.product.bulkPrice),
  }}
  sale={selectedSale} // Pass the selected sale for editing
  onClose={closeUpdateDialog}
  onSubmit={async (updatedSale) => {
    console.log("Updated Sale Data:", updatedSale);
    fetchSales(); // Refresh the sales table
    closeUpdateDialog();
  }}
/>
    </DialogContent>
  </Dialog>
)}
    </Layout>
  );
}