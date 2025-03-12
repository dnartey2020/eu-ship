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
  CANCELED: { label: "Canceled", progress: "0%", color: "bg-red-500" },
};

const TrackingDetails = () => {
  const { trackingId } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["shipment", trackingId],
    queryFn: () => fetchShipment(trackingId as string),
    enabled: !!trackingId,
  });

  if (isLoading)
    return (
      <div className="grid h-screen place-content-center pb-40">Loading...</div>
    );
  if (isError)
    return (
      <div className="grid h-screen place-content-center  pb-40">
        <h1 className="mb-10 text-6xl font-semibold">{error.message}</h1>
        <TrackShipmentBtn />
      </div>
    );

  const statusInfo = statusMap[data.status] || statusMap.PENDING;

  return (
    <div className="container mx-auto mt-24 p-10 print:p-0">
      <div className="mb-8 flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-semibold dark:text-white">
          Shipment Tracking
        </h1>
      </div>

      {/* Tracking Overview */}
      <div className="mb-8 rounded-lg p-6 shadow-md dark:text-white print:shadow-none">
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold ">Tracking Information</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-gray-600 dark:text-gray-200">
                Tracking Number
              </p>
              <p className="font-semibold">{data.trackingNumber}</p>
            </div>
            <div>
              <p className="text-gray-600  dark:text-gray-200">Status</p>
              <p className="font-semibold">{statusInfo.label}</p>
            </div>
            <div>
              <p className="text-gray-600  dark:text-gray-200">Service Type</p>
              <p className="font-semibold">{data.serviceType}</p>
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
            <h3 className="mb-4 text-lg font-semibold">Sender Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {data.senderName}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {data.senderAddress}
              </p>
              <p>
                <span className="font-medium">City:</span> {data.senderCity}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span>{" "}
                {data.senderPostalCode}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {data.senderPhone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Receiver Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Name:</span> {data.receiverName}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {data.receiverAddress}
              </p>
              <p>
                <span className="font-medium">City:</span> {data.receiverCity}
              </p>
              <p>
                <span className="font-medium">Postal Code:</span>{" "}
                {data.receiverPostalCode}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {data.receiverPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold">Package Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.Packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-lg border p-4 dark:border-white"
              >
                <div className="mb-2">
                  <p className="font-medium">Quantity:</p>
                  <p>{pkg.quantity}</p>
                </div>
                <div className="mb-2">
                  <p className="font-medium">Weight:</p>
                  <p>{pkg.weight} kg</p>
                </div>
                <div className="mb-2">
                  <p className="font-medium">Dimensions:</p>
                  <p>{pkg.dimensions} cm</p>
                </div>
                <div>
                  <p className="font-medium">Description:</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {pkg.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Section */}
        {data.Invoice && (
          <div className="border-t pt-6 dark:border-t-white">
            <h3 className="mb-4 text-lg font-semibold">Invoice Details</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Invoice Number:</span>{" "}
                {data.Invoice.invoiceNumber}
              </p>
              <p>
                <span className="font-medium">Amount:</span> $
                {data.Invoice.amount.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Due Date:</span>{" "}
                {format(new Date(data.Invoice.dueDate), "MMM dd, yyyy")}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {data.Invoice.status}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingDetails;
