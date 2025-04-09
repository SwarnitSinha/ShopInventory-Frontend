
import { z } from "zod";

export const insertProductSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        imageUrl: z.any().optional(), // Allow any type for the imageUrl field
        quantity: z.number().min(0, "Quantity must be positive"),
        purchasePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        regularPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        bulkPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
});

// Define the schema for a single product in the sale
const saleProductSchema = z.object({
        product: z.string().min(1, "Product is required"), // Product ID
        quantity: z.number().min(1, "Quantity must be at least 1"),
        pricePerUnit: z.number().min(0, "Price per unit must be at least 0"),
        totalAmount: z.number().min(0, "Total amount must be at least 0"),
      });
      
// Define the schema for the entire sale
export const insertSaleSchema = z.object({
  _id: z.string().optional(), // ✅ Optional for updates
  products: z.array(saleProductSchema), // Array of products
  buyer: z.string().min(1, "Buyer is required"), // Buyer ID
  amountPaid: z.number().min(0, "Amount paid must be at least 0"),
  grandTotal: z.number().min(0, "Total amount must be at least 0"),
  status: z.enum(["completed", "due"]), // Sale status
  saleDate: z.date().nullable(), // Sale date
});
      
// Infer the TypeScript type from the schema
export type InsertSale = z.infer<typeof insertSaleSchema>;

export const insertBuyerSchema = z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(['shopkeeper', 'technician']),
        townId: z.string().min(1, "Town is required"),
      });

// Zod schema for the Town form
export const insertTownSchema = z.object({
        name: z.string().min(1, "Town name is required").trim().toUpperCase(),
        district: z.string().min(1, "District is required").trim().toUpperCase(),
        state: z.string().min(1, "State is required").trim().toUpperCase(),
      });