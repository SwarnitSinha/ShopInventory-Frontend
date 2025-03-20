import { useState } from "react";
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

  // Fetch sales based on filters
  async function fetchSales() {
    try {
      const queryParams = new URLSearchParams(filters as Record<string, string>);
      const response = await fetch(`/api/sales?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sales");
      }
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
      alert("Failed to fetch sales. Please try again.");
    }
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
          <div className="mt-4">
            <Button onClick={fetchSales} className="w-full md:w-auto">
              Search
            </Button>
          </div>
        </div>

        {/* Sales Table */}
        <div className="p-6 flex-1 overflow-auto">
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
                    <TableHead>Price/Unit</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Amount Dues</TableHead>
                    <TableHead>Sale Date</TableHead>
                    <TableHead className="text-right">Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow
                      key={sale.id}
                      className={sale.status === "due" ? "bg-red-50" : "bg-green-50"}
                    >
                      <TableCell>{sale.buyer?.name}</TableCell>
                      <TableCell>{sale.product?.name}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${Number(sale.pricePerUnit).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        ${Number(sale.totalAmount).toFixed(2)}
                      </TableCell>
                      <TableCell>${Number(sale.amountPaid).toFixed(2)}</TableCell>
                      <TableCell>${(sale.totalAmount - sale.amountPaid).toFixed(2)}</TableCell>
                      <TableCell>
                        {format(new Date(sale.saleDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleInvoiceClick(sale)}
                        >
                          Invoice
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
    </Layout>
  );
}