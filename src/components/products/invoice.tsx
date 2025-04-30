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
    <Card className="print:shadow-none w-full min-h-screen sm:max-w-4xl sm:mx-auto sm:my-6 sm:rounded-md sm:shadow-lg bg-white">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
        <div>
        <h1 className="text-2xl font-bold">{localStorage.getItem("shopName")}</h1>
          <span className="font-bold">Invoice</span>
          <p className="text-sm text-muted-foreground">Invoice Number: {sale.invoiceNumber}</p>
        </div>
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
              Print
            </>
          )}
        </Button>
      </CardHeader>
  
      <CardContent className="space-y-6 py-6">
        {/* Sale Metadata */}
        <section className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Invoice Date:</div>
          <div>{new Date(sale.createdAt).toLocaleDateString()}</div>
          <div className="text-muted-foreground">Sale Date:</div>
          <div>{new Date(sale.saleDate).toLocaleDateString()}</div>
          <div className="text-muted-foreground">Buyer:</div>
          <div className="font-medium uppercase">{sale.buyer.name}</div>
        </section>
  
        <hr />
  
        {/* Product Details */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Product Details</h2>
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border text-right">Qty</th>
                <th className="p-2 border text-right">Unit Price</th>
                <th className="p-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.product.id} className="border-t">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{product.product.name}</td>
                  <td className="p-2 border text-right">{product.quantity}</td>
                  <td className="p-2 border text-right">
                    ₹{Number(product.pricePerUnit).toFixed(2)}
                  </td>
                  <td className="p-2 border text-right">
                    ₹{Number(product.totalAmount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
  
        <hr />
  
        {/* Payment Summary */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="font-medium">₹{sale.grandTotal.toLocaleString("en-IN")}</span>
            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="font-medium">₹{sale.amountPaid.toLocaleString("en-IN")}</span>
            <span className="text-muted-foreground">Amount Due:</span>
            <span className={sale.grandTotal - sale.amountPaid > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
              ₹{(sale.grandTotal - sale.amountPaid).toLocaleString("en-IN")}
            </span>
            <span className="text-muted-foreground">Status:</span>
            <span className={`capitalize font-medium ${sale.status === "completed" ? "text-green-600" : "text-red-600"}`}>
              {sale.status}
            </span>
          </div>
        </section>
      </CardContent>
    </Card>
  );
  
}