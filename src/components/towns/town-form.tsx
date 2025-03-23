import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertTownSchema } from "../../schema";
import type { Town, TownFormData } from "../../types";
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
import { useToast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Loader2 } from "lucide-react";

export function TownForm({ town, onClose }: { town?: Town; onClose?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TownFormData>({
    resolver: zodResolver(insertTownSchema),
    defaultValues: town
      ? {
          ...town,
        }
      : {
          name: "",
          district: "",
          state: "Bihar",
        },
  });

  async function onSubmit(data: TownFormData) {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    try {
      if (town) {
        await apiRequest("PATCH", `/api/towns/${town.id}`, data);
        toast({
          title: "Town updated",
          description: "The town has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/towns", data);
        toast({
          title: "Town created",
          description: "The town has been created successfully",
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/towns"] });
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
        <DialogTitle>{town ? "Edit" : "Add"} Town</DialogTitle>
      </DialogHeader>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("Validation errors:", errors);
        })}
        className="space-y-4 py-4"
      >
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
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>District Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {town ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{town ? "Update" : "Create"} Town</>
          )}
        </Button>
      </form>
    </Form>
  );
}