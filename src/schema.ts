
import { z } from "zod";

export const insertProductSchema = z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().min(1, "Description is required"),
        imageUrl: z.string().url("Invalid image URL"),
        quantity: z.number().min(0, "Quantity must be positive"),
        purchasePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        regularPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        bulkPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
});

export const insertSaleSchema = z.object({
        product: z.string().min(1, "Product ID is required"), // Product reference
        buyer: z.string().min(1, "Buyer is required"), // Buyer reference (ObjectId)
        quantity: z.number().min(1, "Quantity must be at least 1"), // Quantity
        pricePerUnit: z.number().min(0, "Price per unit must be positive"), // Price per unit
        totalAmount: z.number().min(0, "Total amount must be positive"), // Total amount
        amountPaid: z.number().min(0, "Amount paid must be positive"), // Amount paid
        status: z.enum(['completed', 'due']).default('due'), // Sale status
        saleDate: z.date().optional(), // Sale date (optional, defaults to now)
      });

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