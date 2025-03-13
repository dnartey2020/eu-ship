import { useMutation } from "@tanstack/react-query";

const createShipment = async (data) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 401) {
        window.location.href =
          "/auth/signin?reason=expired&redirect=" +
          encodeURIComponent(window.location.pathname);
        throw new Error("Session expired");
      }

      let errorMessage = `Shipment creation failed (${res.status} ${res.statusText})`;
      const contentType = res.headers.get("content-type");

      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        const text = await res.text();
        if (text) errorMessage += `: ${text.substring(0, 100)}`;
      }

      const error = new Error(errorMessage);
      // error.status = res.status;
      throw error;
    }

    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Invalid response format from server");
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection.");
    }

    console.error("Shipment creation error:", error);
    throw error;
  }
};

export const useCreateShipment = () => {
  return useMutation({
    mutationFn: async (shipmentData: any) => createShipment(shipmentData),
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};
