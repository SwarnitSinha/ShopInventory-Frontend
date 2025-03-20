import type { Sale } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { useState } from "react";

interface InvoiceProps {
  sale: Sale;
  product: {
    name: string;
    description: string;
  };
}

export function Invoice({ sale, product }: InvoiceProps) {
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
          <span className="text-muted-foreground">Buyer Name:</span>
          <span>{sale.buyer.name.toLocaleUpperCase()}</span>
            <span className="text-muted-foreground">Invoice Date:</span>
            <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
            <span className="text-muted-foreground">Sale Date:</span>
            <span>{new Date(sale.saleDate).toLocaleDateString()}</span>
            
            <span className="text-muted-foreground">Buyer Type:</span>
            <span>{sale.buyer.type.toLocaleUpperCase()}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">Product Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Product Name:</span>
            <span>{product.name}</span>
            <span className="text-muted-foreground">Description:</span>
            <span>{product.description}</span>
            <span className="text-muted-foreground">Quantity:</span>
            <span>{sale.quantity}</span>
            <span className="text-muted-foreground">Price Per Unit:</span>
            <span>${Number(sale.pricePerUnit).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="space-y-2">
          <h3 className="font-semibold">Payment Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Total Amount:</span>
            <span>${Number(sale.totalAmount).toFixed(2)}</span>
            <span className="text-muted-foreground">Amount Paid:</span>
            <span>${Number(sale.amountPaid).toFixed(2)}</span>
            <span className="text-muted-foreground">Amount Due:</span>
            <span>${(sale.totalAmount - sale.amountPaid).toFixed(2)}</span>
            <span className="text-muted-foreground">Sale Status:</span>
            <span>{sale.status === "completed" ? "Completed" : "Due"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}