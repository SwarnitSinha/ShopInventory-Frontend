
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
        buyer: {
          _id: string;
          name: string;
          type: 'shopkeeper' | 'technician';
          town: string;
        };
        product: {
          _id: string;
          name: string;
          description: string;
          quantity: number;
          purchasePrice: number;
          regularPrice: number;
          bulkPrice: number;
          imageUrl: string;
        };
        quantity: number;
        pricePerUnit: number;
        totalAmount: number;
        amountPaid: number;
        status: 'completed' | 'due';
        saleDate: Date;
        createdAt: Date;
        updatedAt: Date;
      };

// New Town definition
export type Town = {
        id: string;
        name: string;
        district: string;
        state: string;
      };
      
export type TownFormData = Omit<Town, "id">; // Excludes `id`


      // New Buyer definition
export type Buyer = {
        id: string;
        name: string;
        type: 'shopkeeper' | 'technician';
        townId: string;
      };
      
      // New BuyerFormData definition
export type BuyerFormData = Omit<Buyer, "id">; // Excludes `id`