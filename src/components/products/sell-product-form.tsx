import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertSaleSchema, type InsertSale } from "@/schema";
import type { Product, Sale } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Invoice } from "./invoice";

export function SellProductForm({ product, onClose }: { product: Product; onClose?: () => void }) {
  const { toast } = useToast();
  const [pricePerUnit, setPricePerUnit] = useState(product.regularPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const form = useForm<InsertSale>({
    resolver: zodResolver(insertSaleSchema),
    defaultValues: {
      productId: product.id,
      buyerName: "",
      quantity: 1,
      pricePerUnit: product.regularPrice,
      totalAmount: product.regularPrice,
    },
  });

  const updateTotalAmount = (quantity: number, price: number) => {
    const total = Number((quantity * Number(price)).toFixed(2));
    form.setValue("totalAmount", total);
    return total;
  };

  async function onSubmit(data: InsertSale) {
    if (data.quantity > product.quantity) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/sales", data);
      toast({
        title: "Sale completed",
        description: "The sale has been recorded successfully",
      });
      // Invalidate both products and sales queries to refresh the data
      await queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      const sale: Sale = await response.json(); // Convert Response to JSON
      setCompletedSale(sale);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (completedSale) {
    return <Invoice sale={completedSale} product={product} />;
  }

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Sell {product.name}</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="buyerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buyer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (Available: {product.quantity})</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max={product.quantity}
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    field.onChange(value);
                    updateTotalAmount(value, pricePerUnit);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Unit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                    setPricePerUnit(value);
                    updateTotalAmount(form.getValues("quantity"), value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center pt-2">
          <div className="text-sm text-muted-foreground">
            Suggested Prices:
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => {
                setPricePerUnit(product.regularPrice);
                form.setValue("pricePerUnit", product.regularPrice);
                updateTotalAmount(form.getValues("quantity"), product.regularPrice);
              }}
            >
              Regular (${Number(product.regularPrice).toFixed(2)})
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setPricePerUnit(product.bulkPrice);
                form.setValue("pricePerUnit", product.bulkPrice);
                updateTotalAmount(form.getValues("quantity"), product.bulkPrice);
              }}
            >
              Bulk (${Number(product.bulkPrice).toFixed(2)})
            </Button>
          </div>
          <div className="text-lg font-semibold">
            Total: ${form.getValues("totalAmount")}
          </div>
        </div>
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Sale...
            </>
          ) : (
            "Complete Sale"
          )}
        </Button>
      </form>
    </Form>
  );
}