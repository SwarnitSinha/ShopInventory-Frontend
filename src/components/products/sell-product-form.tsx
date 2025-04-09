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

export function SellProductForm({
  sale,
  onClose,
  onSubmit,
}: {
  sale?: Sale;
  onClose?: () => void;
  onSubmit?: (data: InsertSale) => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  
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
    <form onSubmit={form.handleSubmit(handleSubmit, (error)=>{
      console.log("Validation errors:", error);
    })} className="space-y-4">
      {/* Buyer and Sale Date */}
<div className="grid grid-cols-5 gap-4">
  {/* Buyer Dropdown */}
  <div className="col-span-3 flex items-center gap-2">
    <label className="text-sm font-medium">Buyer:</label>
    <Select
  value={buyer}
  onValueChange={(value) => {
    console.log("Selected Buyer ID:", value);
    setBuyer(value); // Update state
    form.setValue("buyer", value, { shouldValidate: true, shouldDirty: true }); // Update form
  }}
>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Select a buyer" />
  </SelectTrigger>
  <SelectContent>
    {buyers.map((buyer) => (
      <SelectItem key={buyer.id} value={buyer.id}>
        {buyer.name} - {buyer.town?.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
    {form.formState.errors.buyer && (
    <p className="text-red-500 text-sm">{form.formState.errors.buyer.message}</p>
  )}
  </div>

{/* Sale Date Input */}
<div className="col-span-2 flex items-center gap-2">
  <label className="text-sm font-medium">Sale Date:</label>
  <Input
    type="date"
    className="w-full text-right"
    value={
      form.watch("saleDate") && form.watch("saleDate") instanceof Date
        ? form.watch("saleDate")!.toISOString().split("T")[0] // Ensure yyyy-MM-dd format
        : "" // Handle null or invalid values
    }
    onChange={(e) => {
      const value = e.target.value ? new Date(e.target.value) : null; // Allow null when cleared
      form.setValue("saleDate", value, { shouldValidate: true, shouldDirty: true });
    }}
  />
</div>
</div>

{/* Add Product Button */}
<div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-semibold">Products</h2>
  <Button
    variant="outline"
    size="sm"
    onClick={() => append({ product: "", quantity: 1, pricePerUnit: 0, totalAmount: 0 })}
    className="flex items-center gap-1"
  >
    <span>+</span> Add Product
  </Button>
</div>

      {/* Products Table */}
<div className="overflow-x-auto">
  <table className="min-w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border border-gray-300 px-4 py-2 text-left">Product</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Price Per Unit</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Total Amount</th>
        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
  {fields.map((field, index) => (
    <tr key={field.id}>
      {/* Product Dropdown with Validation */}
      <td className="border border-gray-300 px-4 py-2">
        <Select
          onValueChange={(value) => {
            form.setValue(`products.${index}.product`, value, { shouldValidate: true, shouldDirty: true });
            const selected = products.find((p) => p.id === value);
            if (selected) {
              form.setValue(`products.${index}.pricePerUnit`, Number(selected.regularPrice), { shouldValidate: true, shouldDirty: true });
              form.setValue(`products.${index}.quantity`, 1, { shouldValidate: true, shouldDirty: true });
              form.setValue(`products.${index}.totalAmount`, Number(selected.regularPrice), { shouldValidate: true, shouldDirty: true });
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

        {/* Show validation error if product is not selected */}
        {form.formState.errors.products?.[index]?.product && (
          <p className="text-red-500 text-sm">
            {form.formState.errors.products[index]?.product?.message}
          </p>
        )}
      </td>

      {/* Quantity Input */}
      <td className="border border-gray-300 px-4 py-2">
        <Input
          type="number"
          min="1"
          {...form.register(`products.${index}.quantity`, { valueAsNumber: true })}
          onChange={(e) => {
            const quantity = parseInt(e.target.value) || 0;
            const price = form.getValues(`products.${index}.pricePerUnit`);
            form.setValue(`products.${index}.quantity`, quantity, { shouldValidate: true, shouldDirty: true });
            form.setValue(`products.${index}.totalAmount`, quantity * price, { shouldValidate: true, shouldDirty: true });
          }}
        />
      </td>

      {/* Price Per Unit Input */}
      <td className="border border-gray-300 px-4 py-2">
        <Input
          type="number"
          step="0.01"
          {...form.register(`products.${index}.pricePerUnit`, { valueAsNumber: true })}
          onChange={(e) => {
            const price = parseFloat(e.target.value) || 0;
            const quantity = form.getValues(`products.${index}.quantity`);
            form.setValue(`products.${index}.pricePerUnit`, price, { shouldValidate: true, shouldDirty: true });
            form.setValue(`products.${index}.totalAmount`, quantity * price, { shouldValidate: true, shouldDirty: true });
          }}
        />
      </td>

      {/* Total Amount */}
      <td className="border border-gray-300 px-4 py-2">
        ₹{form.watch(`products.${index}.totalAmount`)?.toFixed(2) || "0.00"}
      </td>

      {/* Remove Button */}
      <td className="border border-gray-300 px-4 py-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => remove(index)}
        >
          Remove
        </Button>
      </td>
    </tr>
  ))}
</tbody>
  </table>
</div>

{/* Total and Dues */}
<div className="grid grid-cols-2 gap-4 items-center">
  {/* Grand Total */}
<div className="text-lg font-semibold">
  Grand Total: ₹{new Intl.NumberFormat("en-IN").format(calculateGrandTotal())}
</div>

  {/* Amount Paid with Validation */}
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
      form.setValue("amountPaid", value, { shouldValidate: true, shouldDirty: true });
    }}
  />

  {/* Show validation error if amount paid is empty */}
  {form.formState.errors.amountPaid && (
    <p className="text-red-500 text-sm">{form.formState.errors.amountPaid.message}</p>
  )}
</div>

{/* Dues */}
<div
  className={`text-lg font-semibold ${
    calculateDues() === 0 ? "text-green-500" : "text-red-500"
  }`}
>
  Dues: ₹{new Intl.NumberFormat("en-IN").format(calculateDues())}
</div>

</div>

      <Button disabled={isSubmitting} type="submit" className="w-full">
        {isSubmitting ? "Processing..." : "Complete Sale"}
      </Button>
    </form>
  );
}