import type { Sale } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { useState } from "react";

interface InvoiceProps {
  sale: Sale;
  products: {
    product: {
      id: string;
      name: string;
      regularPrice: number;
    };
    quantity: number;
    pricePerUnit: number;
    totalAmount: number;
  }[];
}

export function Invoice({ sale, products }: InvoiceProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      await window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <Card className="print:shadow-none">
      <CardHeader className="flex-row items-center justify-between print:!border-b">
        <CardTitle>Invoice</CardTitle>
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="print:hidden"
          disabled={isPrinting}
        >
          {isPrinting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sale Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">Sale Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Invoice Date:</span>
            <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
            <span className="text-muted-foreground">Invoice Number:</span>
            <span><b>{sale.invoiceNumber}</b></span>
            <span className="text-muted-foreground">Buyer Name:</span>
            <span><b>{sale.buyer.name.toLocaleUpperCase()}</b></span>
            <span className="text-muted-foreground">Sale Date:</span>
            <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Product Details Table */}
<div className="space-y-4">
  <h3 className="font-semibold">Product Details</h3>
  <table className="w-full border-collapse border border-gray-300">
    <thead className="bg-gray-100">
      <tr>
        <th className="border border-gray-300 px-4 py-2 text-left">#</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Product Name</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Quantity</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Price Per Unit</th>
        <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product, index) => (
        <tr key={product.product.id} className="border border-gray-300">
          <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
          <td className="border border-gray-300 px-4 py-2">{product.product.name}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">{product.quantity}</td>
          <td className="border border-gray-300 px-4 py-2 text-right">
            ₹{Number(product.pricePerUnit).toFixed(2)}
          </td>
          <td className="border border-gray-300 px-4 py-2 text-right">
            ₹{Number(product.totalAmount).toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Payment Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">Payment Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span>{"\u20B9"}{Number(sale.grandTotal).toLocaleString('en-IN')}</span>
            <span className="text-muted-foreground">Amount Paid:</span>
            <span>{"\u20B9"}{Number(sale.amountPaid).toLocaleString('en-IN')}</span>
            <span className="text-muted-foreground">Amount Due:</span>
            <span>{"\u20B9"}{(sale.grandTotal - sale.amountPaid).toLocaleString('en-IN')}</span>
            <span className="text-muted-foreground">Sale Status:</span>
            <span>{sale.status === "completed" ? "Completed" : "Due"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}