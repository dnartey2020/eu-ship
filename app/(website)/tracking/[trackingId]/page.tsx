"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { TrackShipmentBtn } from "@/components/Tracking/track-shipment-btn";

const fetchShipment = async (trackingNumber: string) => {
  const res = await fetch(`/api/shipments/${trackingNumber}`);
  if (!res.ok) throw new Error("Shipment not found");
  return res.json();
};

const statusMap = {
  PENDING: { label: "Processing", progress: "30%", color: "bg-yellow-500" },
  IN_TRANSIT: { label: "In Transit", progress: "60%", color: "bg-blue-500" },
  DELIVERED: { label: "Delivered", progress: "100%", color: "bg-green-500" },
  CANCELLED: { label: "Cancelled", progress: "0%", color: "bg-red-500" },
};

const TrackingDetails = () => {
  const { trackingId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [],
    queryFn: () => fetchShipment(trackingId as string),
    enabled: !!trackingId,
  });

  if (isLoading)
    return (
      <div className=" grid h-screen place-content-center pb-40">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="grid w-full place-content-center pb-40">
        <h1 className="mb-10 text-6xl font-semibold">{error.message}</h1>
        <span className="mb-15 text-center text-sm text-gray-500">
          Try Again
        </span>
        <TrackShipmentBtn />
      </div>
    );

  if (!data) {
    return (
      <div className="flex items-center justify-center">
        <h1>404</h1>
      </div>
    );
  }

  const statusInfo = statusMap[data.status];
  console.log(statusInfo);

  return (
    <div className="container mx-auto mt-24  p-10 print:p-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-semibold">Shipment Tracking</h1>
      </div>

      {/* Tracking Overview */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md print:shadow-none">
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Tracking Information</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-gray-600">Tracking Number</p>
              <p className="font-semibold">{data.trackingNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-semibold">{statusInfo.label}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Delivery</p>
              <p className="font-semibold">
                {data.deliveryDate
                  ? format(new Date(data.deliveryDate), "MMM dd, yyyy")
                  : "Calculating..."}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${statusInfo.color}`}
              style={{ width: statusInfo.progress }}
            ></div>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="mb-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Pickup Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {format(new Date(data.pickupDate), "MMM dd, yyyy HH:mm")}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {data.pickupAddress}, {data.pickupCity}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Delivery Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Recipient:</span>{" "}
                {data.receiverName}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {data.deliveryAddress}, {data.deliveryCity}
              </p>
              {data.deliveryDate && (
                <p>
                  <span className="font-medium">Delivered:</span>{" "}
                  {format(new Date(data.deliveryDate), "MMM dd, yyyy HH:mm")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Package Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.packages.map((pkg) => (
              <div key={pkg.id} className="rounded-lg border p-4">
                <p className="mb-2 ">Package: {pkg.quantity} qty</p>
                <p>Dimensions: {pkg.dimension} cm</p>
                <p className="mt-2 text-gray-600">
                  Description: {pkg.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Section */}
        {data.invoice && (
          <div className="border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold">Payment Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {data.invoice.invoiceNumber}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> $
                {data.invoice.amount.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {data.invoice.paid ? "Paid" : "Pending"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDetails;
