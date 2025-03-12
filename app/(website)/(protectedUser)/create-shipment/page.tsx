// app/create-shipment/page.tsx
import { CreateShipmentForm } from "@/components/create-shipment/create-shipment-form";

export default function CreateShipmentPage() {
  return (
    <div className="mx-10">
      <h1 className="mb-6 text-2xl font-bold">Create Shipment</h1>
      <CreateShipmentForm />
    </div>
  );
}
