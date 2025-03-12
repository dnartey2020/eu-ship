"use client";

import { useQuery } from "@tanstack/react-query";

const getShipmentHistory = async () => {
  const res = await fetch("/api/shipments", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/auth/signin?reason=expired";
      throw new Error("Session expired");
    }

    const error = await res.json();
    throw new Error(error.message || "Failed to fetch shipments");
  }

  return res.json();
};

export const useShipments = () => {
  return useQuery({
    queryKey: ["shipments"],
    queryFn: getShipmentHistory,
    retry: (failureCount, error) => {
      if (error.message.includes("expired")) return false;
      return failureCount < 2;
    },
  });
};
