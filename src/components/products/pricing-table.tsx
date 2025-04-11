import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useAuth } from "../../hooks/use-auth";
import type { Product } from "../../types";

export function PricingTable({ product }: { product: Product }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const prices = [
    {
      type: "Regular Price",
      price: product.regularPrice,
      showTo: ["admin", "staff", "technician"],
    },
    {
      type: "Bulk Price",
      price: product.bulkPrice,
      showTo: ["admin", "staff"],
    },
  ].filter((p) => p.showTo.includes(user?.role || ""));

  if (prices.length === 0) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Price Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.map((price) => (
          <TableRow key={price.type}>
            <TableCell>{price.type}</TableCell>
            <TableCell className="text-right">
            {"\u20B9"}{Number(price.price).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
