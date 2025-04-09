import { SellProductForm } from "../components/products/sell-product-form";
import { Layout } from "../components/layout/layout";
export default function BillGeneratePage() {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Generate Bill</h1>
        <SellProductForm
          onSubmit={(data) => {
            console.log("Bill generated:", data);
            // Redirect or show a success message
          }}
        />
      </div>
    </Layout>
  );
}