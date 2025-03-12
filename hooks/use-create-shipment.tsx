import { useMutation } from "@tanstack/react-query";

const createshipment = async (data: any) => {
  const res = await fetch("/api/create-shipment", {
    // Changed endpoint for REST consistency
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Clone response for safe consumption
  const responseClone = res.clone();

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/auth/signin?reason=expired";
      throw new Error("Session expired");
    }

    // Read error from cloned response
    const error = await responseClone.json();
    throw new Error(
      error.error || error.message || "Failed to create shipment",
    );
  }

  // Read success data from original response
  return res.json();
};

export const useCreateShipment = () => {
  return useMutation({
    mutationFn: async (shipmentData: any) => createshipment(shipmentData),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};
