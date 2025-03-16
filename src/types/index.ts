
export const UserRole = {
        ADMIN: 'admin',
        STAFF: 'staff',
        TECHNICIAN: 'technician'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export type User = {
        id: string;
        username: string;
        password: string;
        role: UserRoleType;
}

export type Product = {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        quantity: number;
        purchasePrice: string;
        regularPrice: string;
        bulkPrice: string;
}

export type ProductFormData = Omit<Product, "id">; // 🔹 Excludes `id`


export type Sale = {
        id: string;
        productId: string;
        buyerName: string;
        quantity: number;
        pricePerUnit: number;
        totalAmount: number;
        createdAt: Date;
        createdBy: string;
}
