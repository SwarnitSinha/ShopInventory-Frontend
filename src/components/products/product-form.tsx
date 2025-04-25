import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertProductSchema } from "../../schema";
import type { Product, ProductFormData } from "../../types";
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
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from "lucide-react";

export function ProductForm({ 
  product, 
  onClose,
  onActionComplete,
}: { 
  product?: Product; 
  onClose?: () => void;
  onActionComplete: () =>void;
 }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<ProductFormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product
      ? {
        ...product,
        purchasePrice: product.purchasePrice.toString(),
        regularPrice: product.regularPrice.toString(),
        bulkPrice: product.bulkPrice.toString(),
      }
      : {
      name: "",
      description: "",
      // imageUrl: SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)],
      imageUrl: undefined,
      quantity: 0,
      purchasePrice: "0",
      regularPrice: "0",
      bulkPrice: "0",
    },
  });

  async function onSubmit(data: ProductFormData) {
    console.log("Form submitted:", data); // Debugging line
    setIsSubmitting(true);
    try {

      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("quantity", String(data.quantity));
      formData.append("purchasePrice", String(data.purchasePrice));
      formData.append("regularPrice", String(data.regularPrice));
      formData.append("bulkPrice", String(data.bulkPrice));
      
      const imageFile: any = form.getValues("imageUrl");
      formData.append("image",imageFile)

      console.log("IMAGE TYPE: ",typeof(imageFile))
      // Send the FormData to the backend
      // Use apiRequest instead of fetch
    const response = await apiRequest(
      product ? "PATCH" : "POST", // HTTP method
      product ? `/api/products/${product.id}` : "/api/products", // Endpoint
      formData, // Body
    );

      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      toast({
        title: product ? "Product updated" : "Product created",
        description: `The product has been ${product ? "updated" : "created"} successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (onActionComplete) onActionComplete(); 

      if (onClose) onClose();
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

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>{product ? "Edit" : "Add"} Product</DialogTitle>
      </DialogHeader>
      <form
  onSubmit={form.handleSubmit(onSubmit, (errors) => {
    console.log("Validation errors : ", errors);
  })}
  className="space-y-4 py-4"
>
  {/* Line 1: Name and Image */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
  control={form.control}
  name="imageUrl"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product Image</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              field.onChange(file); // Store the File object in the form state
            }
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
  </div>

  {/* Line 2: Description */}
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  {/* Line 3: Quantity and Purchase Price */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="purchasePrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Purchase Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* Line 4: Regular Price and Bulk Price */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormField
      control={form.control}
      name="regularPrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Regular Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={form.control}
      name="bulkPrice"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bulk Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              step="0.01"
              {...field}
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {/* Submit Button */}
  <Button disabled={isSubmitting} type="submit" className="w-full">
    {isSubmitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {product ? "Updating..." : "Creating..."}
      </>
    ) : (
      <>{product ? "Update" : "Create"} Product</>
    )}
  </Button>
</form>
    </Form>
  );
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  "https://images.unsplash.com/photo-1556228578-567ba127e37f",
  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
  "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
  "https://images.unsplash.com/photo-1525904097878-94fb15835963",
];