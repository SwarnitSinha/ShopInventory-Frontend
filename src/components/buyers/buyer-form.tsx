import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertBuyerSchema } from "../../schema";
import type { Buyer, BuyerFormData } from "../../types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useTown } from "../../hooks/use-town";

export function BuyerForm({ buyer, onClose }: { buyer?: Buyer; onClose?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { towns, townsLoading } = useTown();
  
  const buyerTypes = [
    { id: "shopkeeper", name: "Shopkeeper" },
    { id: "technician", name: "Technician" },
  ];

  const form = useForm<BuyerFormData>({
    resolver: zodResolver(insertBuyerSchema),
    defaultValues: buyer
      ? {
          ...buyer,
          townId: buyer.townId ?? "",
        }
      : {
          name: "",
          type: "technician",
          townId: "",
        },
  });

  async function onSubmit(data: BuyerFormData) {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    try {
      if (buyer) {
        await apiRequest("PATCH", `/api/buyers/${buyer.id}`, data);
        toast({
          title: "Buyer updated",
          description: "The buyer has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/buyers", data);
        toast({
          title: "Buyer created",
          description: "The buyer has been created successfully",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/buyers"] });
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
        <DialogTitle>{buyer ? "Edit" : "Add"} Buyer</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors:", errors);
      })} className="space-y-4 py-4">
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buyer Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {buyerTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="townId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Town</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={townsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select town" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {townsLoading ? (
                    <SelectItem value="loading" disabled>Loading towns...</SelectItem>
                  ) : (
                    towns?.map((town) => (
                      <SelectItem key={town.id} value={town.id}>
                        {town.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {buyer ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{buyer ? "Update" : "Create"} Buyer</>
          )}
        </Button>
      </form>
    </Form>
  );
}