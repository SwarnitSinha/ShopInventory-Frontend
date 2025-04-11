import type { Product, Sale } from "../../types";
import { Buyer } from "../../types";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSaleSchema, type InsertSale } from "../../schema";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";
import { PlusCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "../../components/ui/dialog"; // Adjust path as needed
import { BuyerForm } from "../buyers/buyer-form"; // Adjust path as needed

export function SellProductForm({
  sale,
  onClose,
  onSubmit,
}: {
  sale?: Sale | null;
  onClose?: () => void;
  onSubmit?: (data: InsertSale) => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isBuyerModalOpen, setBuyerModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);

  const form = useForm<InsertSale>({
    resolver: zodResolver(insertSaleSchema),
    defaultValues: {
      products: sale
        ? sale.products.map((p) => ({
            product: p.product.id,
            quantity: p.quantity,
            pricePerUnit: p.pricePerUnit,
            totalAmount: p.totalAmount,
          }))
        : [
            {
              product: "",
              quantity: 1,
              pricePerUnit: 0,
              totalAmount: 0,
            }
          ],
      // buyer: sale?.buyer?.id || "",
      buyer: "swarnit",
      amountPaid: sale?.amountPaid || 0,
      status: sale?.status || "due",
      saleDate: sale?.saleDate ? new Date(sale.saleDate) : new Date(),
      grandTotal: sale?.grandTotal || 0,
    },
  });
  const [buyer, setBuyer] = useState(form.watch("buyer") || ""); 
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      setBuyer(values.buyer || ""); // Keep buyer in sync
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    console.log("Sale Products:", sale?.products);
    console.log("Form Products:", form.getValues("products"));
  }, [sale, form]);

  useEffect(() => {
  async function fetchData() {
    try {
      const buyersResponse = await apiRequest("GET", "/api/buyers");
      const buyersData = await buyersResponse.json();
      setBuyers(buyersData);

      const productsResponse = await apiRequest("GET", "/api/products");
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load buyers or products",
        variant: "destructive",
      });
    }
  }

  fetchData();
}, [toast]);

useEffect(() => {
  if (sale && buyers.length > 0 && products.length > 0) {
    console.log("Setting form values from sale:", sale);

    form.reset({
      _id: sale._id || "",
      products: sale.products.map((p) => ({
        product: p.product?._id || "",
        quantity: p.quantity,
        pricePerUnit: p.pricePerUnit,
        totalAmount: p.totalAmount,
      })),
      buyer: sale.buyer?._id || "", // Extract the buyer ID correctly
      amountPaid: sale.amountPaid || 0,
      status: sale.status || "due",
      saleDate: sale.saleDate ? new Date(sale.saleDate) : new Date(),
      grandTotal: sale.grandTotal || 0,
    });
  }
}, [sale, buyers, products, form]);

  const calculateTotal = () => {
    const products = form.getValues("products");
    return products.reduce((sum, p) => sum + p.totalAmount, 0);
  };

  const calculateGrandTotal = () => {
    const products = form.watch("products") || [];
    return products.reduce((sum, product) => sum + (product.totalAmount || 0), 0);
  };

  const calculateDues = () => {
    const total = calculateTotal(); // Grand Total
    const amountPaid = form.watch("amountPaid") || 0; // Watch for changes to amountPaid
    console.log("TOTAL ND PAID: ", total, amountPaid);
    return total - amountPaid;
  };

  async function handleSubmit(data: InsertSale) {
    const grandTotal = calculateGrandTotal(); // Calculate grand total
    const status = calculateDues() === 0 ? "completed" : "due"; // Determine status based on dues
    const validatedData = {
      ...data,
      grandTotal, // Add grand total to the submission data
      status,
    };
  
    console.log("Validated Form Data:", validatedData);
    console.log("ID Data:", data._id);
  
    setIsSubmitting(true);
    try {
      const response = data._id
      ? await apiRequest("PATCH", `/api/sales/${data._id}`, validatedData) // ✅ Update sale if _id exists
      : await apiRequest("POST", "/api/sales", validatedData);
      
      data._id? 
      toast({
        title: "Bill Updated",
        description: "The sale has been updated successfully",
      }) 
      :
      toast({
        title: "Sale completed",
        description: "The sale has been recorded successfully",
      });
  
      form.reset()
      // if (onSubmit) {
      //   onSubmit(validatedData);
      // }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      if(onClose) {
        onClose(); // Close the form after submission
      }
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit, (error) => {
        console.log("Validation errors:", error);
      })}
      className="space-y-6"
    >
      {/* Buyer and Sale Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buyer */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Buyer:</label>
          <Select
  value={buyer}
  onValueChange={(value) => {
    if (value === "new") {
      setBuyerModalOpen(true);
    } else {
      setBuyer(value);
      form.setValue("buyer", value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a buyer" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="__placeholder__" disabled>
      Select a buyer
    </SelectItem>
    {buyers.map((buyer) => (
      <SelectItem key={buyer.id} value={buyer.id}>
        {buyer.name} - {buyer.town?.name}
      </SelectItem>
    ))}
    <SelectItem value="new" className="text-primary font-semibold">
      ➕ New Buyer
    </SelectItem>
  </SelectContent>
</Select>
          {form.formState.errors.buyer && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.buyer.message}
            </p>
          )}
        </div>
  
        {/* Sale Date */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Sale Date:</label>
          <Input
            type="date"
            className="w-full text-right"
            value={
              form.watch("saleDate") instanceof Date
                ? form.watch("saleDate")!.toISOString().split("T")[0]
                : ""
            }
            onChange={(e) => {
              const value = e.target.value ? new Date(e.target.value) : null;
              form.setValue("saleDate", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </div>
      </div>
  
      {/* Add Product Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              product: "",
              quantity: 1,
              pricePerUnit: 0,
              totalAmount: 0,
            })
          }
          className="flex items-center gap-2 hover:shadow-md hover:border-primary transition-all duration-200 group"
        >
          <PlusCircle className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-primary group-hover:underline">
            Add Product
          </span>
        </Button>
      </div>
  
      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm">Product</th>
              <th className="px-4 py-2 text-left text-sm">Quantity</th>
              <th className="px-4 py-2 text-left text-sm">Price Per Unit</th>
              <th className="px-4 py-2 text-left text-sm">Total</th>
              <th className="px-4 py-2 text-center text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id} className="border-t">
                <td className="px-4 py-2">
                  <Select
                    onValueChange={(value) => {
                      form.setValue(`products.${index}.product`, value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      const selected = products.find((p) => p.id === value);
                      if (selected) {
                        form.setValue(
                          `products.${index}.pricePerUnit`,
                          Number(selected.regularPrice),
                          { shouldValidate: true, shouldDirty: true }
                        );
                        form.setValue(
                          `products.${index}.quantity`,
                          1,
                          { shouldValidate: true, shouldDirty: true }
                        );
                        form.setValue(
                          `products.${index}.totalAmount`,
                          Number(selected.regularPrice),
                          { shouldValidate: true, shouldDirty: true }
                        );
                      }
                    }}
                    value={form.watch(`products.${index}.product`) || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.products?.[index]?.product && (
                    <p className="text-red-500 text-sm">
                      {form.formState.errors.products[index]?.product?.message}
                    </p>
                  )}
                </td>
  
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    min="1"
                    {...form.register(`products.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 0;
                      const price = form.getValues(
                        `products.${index}.pricePerUnit`
                      );
                      form.setValue(`products.${index}.totalAmount`, quantity * price, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  />
                </td>
  
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register(`products.${index}.pricePerUnit`, {
                      valueAsNumber: true,
                    })}
                    onChange={(e) => {
                      const price = parseFloat(e.target.value) || 0;
                      const quantity = form.getValues(
                        `products.${index}.quantity`
                      );
                      form.setValue(
                        `products.${index}.totalAmount`,
                        quantity * price,
                        { shouldValidate: true, shouldDirty: true }
                      );
                    }}
                  />
                </td>
  
                <td className="px-4 py-2 font-medium">
                  ₹{form.watch(`products.${index}.totalAmount`)?.toFixed(2) || "0.00"}
                </td>
  
                <td className="px-4 py-2 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Totals and Payment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="text-lg font-semibold">
          Grand Total: ₹{new Intl.NumberFormat("en-IN").format(calculateGrandTotal())}
        </div>
  
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Amount Paid:</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            {...form.register("amountPaid", { valueAsNumber: true })}
            value={form.watch("amountPaid") || 0}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              form.setValue("amountPaid", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
          {form.formState.errors.amountPaid && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.amountPaid.message}
            </p>
          )}
        </div>
  
        <div
          className={`text-lg font-semibold ${
            calculateDues() === 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          Dues: ₹{new Intl.NumberFormat("en-IN").format(calculateDues())}
        </div>
      </div>
  
      {/* Submit Button */}
      <Button disabled={isSubmitting} type="submit" className="w-full mt-4">
        {isSubmitting ? "Processing..." : "Complete Sale"}
      </Button>

      <Dialog open={isBuyerModalOpen} onOpenChange={setBuyerModalOpen}>
  <DialogContent className="sm:max-w-md">
    <BuyerForm
      onClose={() => {
        setBuyerModalOpen(false);
        // Refresh the buyers list
        fetch("/api/buyers")
          .then((res) => res.json())
          .then((data) => setBuyers(data));
      }}
    />
  </DialogContent>
</Dialog>

    </form>

    
  );
}