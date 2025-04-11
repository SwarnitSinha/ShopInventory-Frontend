import { SellProductForm } from "../components/products/sell-product-form";
import { Layout } from "../components/layout/layout";
import { useEffect, useState } from "react";
import { Sale } from "../types";
export default function BillGeneratePage() {

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    const storedSale = sessionStorage.getItem("selectedSale");
    if (storedSale) {
      try {
        const parsedSale = JSON.parse(storedSale);
        setSelectedSale(parsedSale); // <- your state to pass to SellProductForm
        sessionStorage.removeItem("selectedSale"); // optional cleanup
      } catch (error) {
        console.error("Invalid sale data in sessionStorage");
      }
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>
        <SellProductForm
          sale={selectedSale}
          onSubmit={(data) => {
            console.log("Bill generated:", data);
            // Redirect or show a success message
          }}
        />
      </div>
    </Layout>
  );
}