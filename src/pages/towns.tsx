import { SidebarNav } from "../components/layout/sidebar-nav";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TownCard } from "../components/towns/town-card";
import { TownForm } from "../components/towns/town-form";
import { Dialog, DialogTrigger, DialogContent } from "../components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import type { Town } from "../types";
import { Layout } from "../components/layout/layout";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function Towns() {
  const { user } = useAuth();
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const queryClient = useQueryClient(); 
    
  const { data: towns } = useQuery<Town[]>({
    queryKey: ["/api/towns"],
    queryFn: async ()=>{
          const response = await apiRequest("GET", "/api/towns");
          return response.json();
        },
  });

  return (
    <Layout>
        <div className="flex h-screen">
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-14 border-b flex items-center justify-center relative">
            <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 md:relative md:left-auto md:translate-x-0">Towns</h1>
          </div>

          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {towns?.length === 0 && (
                <div className="text-center text-gray-500">No towns available. Add Towns!</div>
              )}
              {towns?.map((town) => (
                <TownCard key={town.id} town={town} />
              ))}
            </div>
          </div>

          {/* Floating Add Town Button */}
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
              <Button
                size="lg"
                className="fixed bottom-4 right-4 bg-primary text-white shadow-lg rounded-full p-4 md:p-3"
              >
                <Plus className="h-5 w-5 mr-1" />
                Add Town
              </Button>
              </DialogTrigger>
              <DialogContent>
                <TownForm 
                onClose={() => setAddDialogOpen(false)}
                onActionComplete={() => {
                  queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
                  setAddDialogOpen(false);
                }}
                />
              </DialogContent>
            </Dialog>
        </main>
      </div>
    </Layout>
  );
}
