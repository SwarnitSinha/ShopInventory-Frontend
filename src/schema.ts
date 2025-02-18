
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
        productId: z.string().min(1, "Product ID is required"),
        buyerName: z.string().min(1, "Buyer name is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        pricePerUnit: z.number().min(0, "Price per unit must be positive"),
        totalAmount: z.number().min(0, "Total amount must be positive"),
});

export type InsertSale = z.infer<typeof insertSaleSchema>;