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
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { MoreVertical, FileText, Edit, Trash } from "lucide-react"; // Import icons
import { useToast } from "../hooks/use-toast";


export default function Sales() {
  const [filters, setFilters] = useState({
    buyerName: "",
    productName: "",
    townName: "",
    startDate: "",
    endDate: "",
    invoiceNumber: "",
  }); // State for filters
  const [sales, setSales] = useState<Sale[]>([]); // State for sales data
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null); // State for selected sale
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false); // State for update dialog visibility
  const [isGenerateBillOpen, setIsGenerateBillOpen] = useState(false); // State for "Generate Bill" modal
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All"); // State for status filter
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const { toast } = useToast();
  // Fetch sales based on filters
  // Fetch all sales (initial load or reset)
  async function fetchInitialSales() {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET","/api/sales?page=1&limit=100");
      if (!response.ok) {
        throw new Error("Failed to fetch initial sales");
      }
      const jsonRes = await response.json();
      const data = jsonRes.data; 
      console.log("Data coming: ",data)
      const mappedSales = data.map((sale: any) => ({
        ...sale,
        // id: sale._id, // Map `_id` to `id`
        // buyer: {
        //   ...sale.buyer,
        //   id: sale.buyer._id, // Map buyer `_id` to `id`
        // },
        // product: {
        //   ...sale.product,
        //   id: sale.product._id, // Map product `_id` to `id`
        // },
      }));
      console.log("mapped Sale;:: ",mappedSales);
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
      console.log("Filters being sent to API:", queryParams.toString()); // Debugging

      const response = await apiRequest('GET',`/api/sales/filter?${queryParams.toString()}`);
      console.log("API Response Status:", response.status); // Debugging
      console.log("API Response OK:", response.ok); // Debugging

      if (!response.ok) {
        throw new Error(`Failed to fetch sales. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response Data:", data); // Debugging

      // Map the API response to match the `Sale` type
      const mappedSales = data.map((sale: any) => ({
        ...sale,
        // id: sale._id, // Map `_id` to `id`
        // buyer: sale.buyer
        //   ? {
        //     ...sale.buyer,
        //     id: sale.buyer._id || "", // Map buyer `_id` to `id`
        //   }
        //   : null, // Handle missing buyer
        // product: sale.product
        //   ? {
        //     ...sale.product,
        //     id: sale.product._id || "", // Map product `_id` to `id`
        //   }
        //   : null, // Handle missing product
      }));
      console.log("no error till now: ",mappedSales);
      setSales(mappedSales);
    } catch (error) {
      console.error("Error in fetchSales:", error); // Debugging
      alert("Failed to fetch sales. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch initial sales data when the component mounts
  useEffect(() => {
    fetchInitialSales();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal(); // your modal closing function
      }
    };
    if (isModalOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  function resetFilters() {
    setFilters({
      buyerName: "",
      productName: "",
      townName: "",
      startDate: "",
      endDate: "",
      invoiceNumber: "",
    });
    fetchInitialSales();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleInvoiceClick(sale: Sale) {
    console.log("invoice clicked");
    setSelectedSale(sale); // Set the selected sale
    setIsModalOpen(true); // Open the modal
  }

  function closeModal() {
    setIsModalOpen(false); // Close the modal
    setSelectedSale(null); // Clear the selected sale
  }

  function handleUpdateClick(sale: Sale) {
    sessionStorage.setItem("selectedSale", JSON.stringify(sale));
    window.location.href = "/bill-generate";
  }

  function closeUpdateDialog() {
    setUpdateDialogOpen(false); // Close the update dialog
    setSelectedSale(null); // Clear the selected sale
    fetchInitialSales();
  }

  async function handleDeleteClick(sale: Sale) {
    console.log("SALE ID : ", sale._id);
    console.log("SALE : ", sale);
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        const response = await apiRequest("POST", `/api/sales/delete/${sale._id}`);
        if (!response.ok) {
          throw new Error("Failed to delete sale");
        }
        // alert("Sale deleted successfully");
        toast({
          title: "Sale deleted successfully.",
        }) 
        fetchInitialSales(); // Refresh the sales table
      } catch (error) {
        console.error("Failed to delete sale:", error);
        alert("Failed to delete sale. Please try again.");
      }
    }
  }

  const filteredSales = sales.filter((sale) => {
    if (statusFilter === "All") return true;
    return sale.status === statusFilter;
  });

  return (
    <Layout>
      <div className="flex h-screen flex-col">
        {/* Filter Section */}
        <div className="p-4 bg-gray-100 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Search Sales</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsSearchExpanded((prev) => !prev)}
                className="bg-gray-500 text-white hover:bg-gray-600"
              >
                {isSearchExpanded ? "Collapse" : "Filters"}
              </Button>
              <Button
                onClick={() => window.location.href = "/bill-generate"}
                className="bg-primary text-white"
              >
                Generate Bill
              </Button>
            </div>
          </div>

          {isSearchExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Buyer Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Buyer</label>
                <Input
                  type="text"
                  name="buyerName"
                  value={filters.buyerName}
                  onChange={handleInputChange}
                  placeholder="Enter buyer name"
                />
              </div>

              {/* Product Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <Input
                  type="text"
                  name="productName"
                  value={filters.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </div>

              {/* Invoice Number Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Invoice Number</label>
                <Input
                  type="text"
                  name="invoiceNumber"
                  value={filters.invoiceNumber}
                  onChange={handleInputChange}
                  placeholder="Enter town name"
                />
              </div>

              {/* Town Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Town</label>
                <Input
                  type="text"
                  name="townName"
                  value={filters.townName}
                  onChange={handleInputChange}
                  placeholder="Enter town name"
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
          )}
          {isSearchExpanded && (
            <div className="mt-4 flex justify-center gap-4">
              <Button onClick={resetFilters} className="w-full md:w-auto bg-gray-500 hover:bg-gray-600">
                Reset
              </Button>
              <Button onClick={fetchSales} className="w-full md:w-auto">
                Search
              </Button>
            </div>
          )}

        </div>

        {/* Sales Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">Loading sales...</div>          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <span>Recent Sales</span>
                  <div className="ml-auto">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="due">Due</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total Items</TableHead>
                      <TableHead className="text-right">Grand Total</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Amount Due</TableHead>
                      <TableHead>Sale Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-500">
                          No records found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSales.map((sale) => (
                        <TableRow key={sale.id || sale._id || Math.random()} className={sale.status === "due" ? "bg-red-50" : "bg-green-50"}>
                          <TableCell>{sale.buyer?.name || "N/A"}</TableCell>
                          <TableCell>
  {sale.products.slice(0, 2).map((p, index) => (
    <span key={p.product?.id || `product-${index}`} className="mr-2">
      {p.product?.name}
    </span>
  ))}
  {sale.products.length > 2 && <span>...</span>}
</TableCell>
                          <TableCell>
                            {sale.products.reduce((sum, p) => sum + p.quantity, 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            {"\u20B9"}{Number(sale.grandTotal).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {"\u20B9"}{Number(sale.amountPaid).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {"\u20B9"}{(sale.grandTotal - sale.amountPaid).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(sale.saleDate), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-blue-500 hover:bg-gray-100 rounded" onClick={() => handleInvoiceClick(sale)} title="View Invoice">
                                <FileText className="h-5 w-5" />
                              </button>
                              <button className="p-2 text-green-500 hover:bg-gray-100 rounded" onClick={() => handleUpdateClick(sale)} title="Update Sale">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="p-2 text-red-500 hover:bg-gray-100 rounded" onClick={() => handleDeleteClick(sale)} title="Delete Sale">
                                <Trash className="h-5 w-5" />
                              </button>
                            </div>
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
    <div className="relative w-full max-w-3xl sm:rounded bg-white shadow-lg overflow-y-auto max-h-[90vh]">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
        onClick={closeModal}
      >
        ✕
      </button>
      <Invoice sale={selectedSale} products={selectedSale.products} />
    </div>
  </div>
)}

      {updateDialogOpen && selectedSale && (
        <Dialog open={updateDialogOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              resetFilters(); // Reset filters and fetch initial sales data
              closeUpdateDialog();
            }
          }}
        >
          <DialogContent className="max-w-4xl">
          <DialogTitle>Edit Sale</DialogTitle> {/* Add this line */}
            <SellProductForm
              sale={selectedSale} // Pass the selected sale for editing
              onClose={closeUpdateDialog}
              onSubmit={async (updatedSale) => {
                console.log("Updated Sale Data:", updatedSale);
                fetchInitialSales(); // Refresh the sales table
                closeUpdateDialog();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {isGenerateBillOpen && (
        <Dialog
          open={isGenerateBillOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              resetFilters(); // Reset filters and fetch initial sales data
              setIsGenerateBillOpen(false);
            }
          }}
        >
          <DialogContent>
            <DialogTitle>Generate Bill</DialogTitle> {/* Add this line */}
            <SellProductForm
              onClose={() => setIsGenerateBillOpen(false)}
              onSubmit={async (newSale) => {
                console.log("New Sale Data:", newSale);
                fetchInitialSales(); // Refresh the sales table
                setIsGenerateBillOpen(false); // Close the modal
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}