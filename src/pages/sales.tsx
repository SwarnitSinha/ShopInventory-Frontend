import { SidebarNav } from "@/components/layout/sidebar-nav";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Sale } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Sales() {
  const { data: sales } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-auto bg-background">
        <div className="h-14 border-b flex items-center px-4">
          <h1 className="text-lg font-medium">Sales History</h1>
        </div>
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Product ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales?.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {format(new Date(sale.createdAt), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>{sale.buyerName}</TableCell>
                      <TableCell>{sale.productId}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>${Number(sale.pricePerUnit).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        ${Number(sale.totalAmount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
