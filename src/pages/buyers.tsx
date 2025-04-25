import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import type { Buyer } from "../types";
import { Layout } from "../components/layout/layout";
import { BuyerForm } from "../components/buyers/buyer-form";
import { BuyerCard } from "../components/buyers/buyer-card";
import { apiRequest } from "@/lib/queryClient";

export default function Buyers() {
  const { user } = useAuth();

  const { data: buyers, isLoading, isError } = useQuery<Buyer[]>({
    queryKey: ["/api/buyers"],
    queryFn: async ()=>{
      const response = await apiRequest("GET", "/api/buyers");
      return response.json();
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  return (
    <Layout>
      <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-14 border-b flex items-center justify-center relative">
            <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">Buyers</h1>
          </div>

          <div className="p-6">
            {/* Loading and Error States */}
            {isLoading && <p>Loading buyers...</p>}
            {isError && <p className="text-red-500">Failed to load buyers.</p>}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {buyers?.length === 0 && (
                <p className="text-gray-500">No buyers found. Add your buyers!</p>
              )}
              {buyers?.map((buyer) => (
                <BuyerCard key={buyer.id} buyer={buyer} />
              ))}
            </div>
          </div>

          {/* Floating Add Buyer Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="fixed bottom-4 right-4 bg-primary text-white shadow-lg rounded-full p-4 md:p-3"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add Buyer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <BuyerForm />
              </DialogContent>
            </Dialog>
        </main>
    </div>
    </Layout>
  );
}