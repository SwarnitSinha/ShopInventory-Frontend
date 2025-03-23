import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertSaleSchema, type InsertSale } from "../../schema";
import type { Product, Sale } from "../../types";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { Buyer } from "../../types";

export function SellProductForm({
  product,
  sale,
  onClose,
  onSubmit,
}: {
  product: Product;
  sale?: Sale; // Optional sale prop for prepopulating fields
  onClose?: () => void;
  onSubmit?: (data: InsertSale) => void; // Optional custom submit handler
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  // Fetch buyers from API
  useEffect(() => {
    async function fetchBuyers() {
      try {
        const response = await apiRequest("GET", "/api/buyers");
        const data = await response.json();
        setBuyers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch buyers",
          variant: "destructive",
        });
      }
    }
    fetchBuyers();
  }, []);

  const form = useForm<InsertSale>({
    resolver: zodResolver(insertSaleSchema),
    defaultValues: {
      product: product.id,
      buyer: sale?.buyer?.id || "", // Prepopulate buyer if sale exists
      quantity: sale?.quantity || 1,
      pricePerUnit: sale?.pricePerUnit || Number(product.regularPrice),
      totalAmount: sale?.totalAmount || Number(product.regularPrice),
      amountPaid: sale?.amountPaid || 0,
      status: sale?.status || "due",
      saleDate: sale?.saleDate ? new Date(sale.saleDate) : new Date(),
    },
  });

  const updateTotalAmount = (quantity: number, price: number) => {
    const total = (quantity * Number(price)).toFixed(2);
    form.setValue("totalAmount", Number(total));
    return total;
  };

  async function handleSubmit(data: InsertSale) {
    console.log("Form Submitted:", data);

    if (data.quantity > product.quantity) {
      toast({
        title: "Error",
        description: "Not enough stock available",
        variant: "destructive",
      });
      return;
    }

    // Determine sale status
    data.status = data.amountPaid < data.totalAmount ? "due" : "completed";

    setIsSubmitting(true);
    try {
      if (sale) {
        // Update existing sale
        await apiRequest("PATCH", `/api/sales/${sale.id}`, data);
        toast({
          title: "Sale updated",
          description: "The sale has been updated successfully",
        });
      } else {
        // Create new sale
        await apiRequest("POST", "/api/sales", data);
        toast({
          title: "Sale completed",
          description: "The sale has been recorded successfully",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/sales"] });

      if (onSubmit) {
        onSubmit(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      if (onClose) {
        onClose();
      }
    }
  }

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>{sale ? `Update Sale` : `Sell ${product.name}`}</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log("Validation errors:", errors);
        })}
        className="space-y-4 py-4"
      >
        {/* Buyer Dropdown */}
        <FormField
  control={form.control}
  name="buyer"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Buyer</FormLabel>
      <Select
        onValueChange={(value) => {
          field.onChange(value); // Update the form state
        }}
        value={field.value || ""} // Bind the current value to the dropdown
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a buyer">
              {buyers.find((buyer) => buyer.id === field.value)?.name || "Select a buyer"}
            </SelectValue>
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {buyers.map((buyer) => (
            <SelectItem key={buyer.id} value={buyer.id}>
              {buyer.name} {/* Display buyer name */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>

        {/* Quantity */}
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
                    updateTotalAmount(value, Number(form.getValues("pricePerUnit")));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Per Unit */}
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
                    updateTotalAmount(Number(form.getValues("quantity")), value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sale Date */}
        <FormField
          control={form.control}
          name="saleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Paid */}
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount Paid</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Total Amount */}
        <div className="text-lg font-semibold">
          Total: ${form.getValues("totalAmount")}
        </div>

        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {sale ? "Updating Sale..." : "Processing Sale..."}
            </>
          ) : sale ? (
            "Update Sale"
          ) : (
            "Complete Sale"
          )}
        </Button>
      </form>
    </Form>
  );
}