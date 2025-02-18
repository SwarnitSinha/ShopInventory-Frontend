import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Package, DollarSign, ShoppingCart } from "lucide-react";
import type { Product } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: products } = useQuery<Product[]>({ 
    queryKey: ["/api/products"]
  });

  const metrics = [
    {
      title: "Total Products",
      icon: Package,
      value: products?.length || 0,
    },
    {
      title: "Low Stock Items",
      icon: ShoppingCart,
      value: products?.filter((p) => p.quantity < 10).length || 0,
    },
    {
      title: "Total Inventory Value",
      icon: DollarSign,
      value: `$${products?.reduce((sum, p) => sum + Number(p.purchasePrice) * p.quantity, 0).toFixed(2) || "0.00"}`,
    },
  ];

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <main className="flex-1 overflow-auto bg-background">
        <div className="h-14 border-b flex items-center px-4">
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
        
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {products && products.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} in stock
                          </p>
                        </div>
                      </div>
                      {user?.role === "admin" && (
                        <p className="font-medium">
                          ${Number(product.purchasePrice).toFixed(2)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
