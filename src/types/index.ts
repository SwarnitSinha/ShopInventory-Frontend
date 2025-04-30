export type Shop = {
        id: string;
        username: string;
        password: string;
        shopName: string;
        ownerName: string;
        phone: string;
        description: string;
        address: string;
        email: string;
}

export type Product = {
        id: string;
        _id?: string;
        name: string;
        description: string;
        imageUrl?: any;
        quantity?: number;
        purchasePrice?: string;
        regularPrice?: string;
        bulkPrice?: string;
}

export type ProductFormData = Omit<Product, "id">; // 🔹 Excludes `id`


export type Sale = {
        id: string;
        _id: string;
        invoiceNumber: string;
        buyer: {
          id: string;
          _id: string;
          name: string;
          type: 'shopkeeper' | 'technician';
          town: string;
        };
        products: {
                product: {
                  id: string;
                  _id: string;
                  name: string;
                  regularPrice: number;
                };
                quantity: number;
                pricePerUnit: number;
                totalAmount: number;
              }[];
        quantity: number;
        pricePerUnit: number;
        grandTotal: number;
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
        townId?: string; // Keep townId for backward compatibility
        town?: {
          id: string;
          name: string;
          district: string;
          state: string;
          country: string;
        }; // Add the town object
      };
      
      // New BuyerFormData definition
export type BuyerFormData = Omit<Buyer, "id">& { townId: string }; // Excludes `id`