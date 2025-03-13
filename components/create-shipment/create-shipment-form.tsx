"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shipmentSchema } from "@/lib/validation";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateShipment } from "@/hooks/use-create-shipment";
import { useRouter } from "next/navigation";

import { ItemCard } from "./item-card";
import { calculateShippingCost } from "@/lib/cost-of-package";

// Infer the form values type from the shipmentSchema.
type ShipmentFormData = z.infer<typeof shipmentSchema>;

// Local type for package sub-form values.
type PackageData = {
  weight: number;
  length: number;
  width: number;
  height: number;
  description: "";
  quantity: number;
};

export const CreateShipmentForm = () => {
  const { mutate, isPending } = useCreateShipment();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      senderName: "",
      contactPhone: "",
      pickupAddress: "",
      pickupCity: "",
      pickupGeoCoordinate: "",
      pickupDate: undefined,
      pickupTime: "",
      receiverName: "",
      receiverPhone: "",
      deliveryAddress: "",
      deliveryCity: "",
      deliveryGeoCoordinate: "",
      estimatedCost: 0,
      packages: [],
    },
  });

  // Local state for package sub-form.
  const [pkg, setPkg] = useState<PackageData>({
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    description: "",
    quantity: 1,
  });

  // List of packages added.
  const [packagesList, setPackagesList] = useState<PackageData[]>([]);

  // Handle changes in package input fields.
  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPkg((prev) => {
      // List of fields that should be numeric
      const numericFields = ["weight", "quantity", "length", "height", "width"];
      if (numericFields.includes(name)) {
        // Allow empty string or a valid number (integer or decimal)
        const numericRegex = /^\d*\.?\d*$/;
        if (value === "" || numericRegex.test(value)) {
          return {
            ...prev,
            [name]: value === "" ? "" : Number(value),
          };
        }
        // If input doesn't match the numeric pattern, keep the previous value
        return prev;
      }
      return { ...prev, [name]: value };
    });
  };
  // Add package to the list.
  const addPackage = () => {
    if (
      pkg.weight <= 0 ||
      !pkg.description.trim() ||
      pkg.quantity <= 0 ||
      pkg.width <= 0 ||
      pkg.height <= 0 ||
      pkg.length <= 0
    ) {
      alert(
        "Please provide valid package weight, width, height, description, and quantity.",
      );
      return;
    }
    setPackagesList((prev) => [...prev, pkg]);
    setPkg({
      weight: 0,
      height: 0,
      description: "",
      quantity: 1,
      length: 0,
      width: 0,
    });
  };

  const removePackage = (index: number) => {
    setPackagesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Final form submit handler.
  const handleFormSubmit: SubmitHandler<ShipmentFormData> = (data) => {
    if (packagesList.length === 0) {
      toast.warning("Please add at least one package.");
      return;
    }
    data.packages = packagesList;

    mutate(data, {
      onSuccess: () => {
        toast.success("Shipment created successfully!");
        router.push("/shipping-history");
      },
      onError: (err: any) => {
        toast.error("Error: " + err.message);
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("flex h-full flex-col gap-6")}
    >
      {/* Sender Information */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Sender Information</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="senderName">Sender Name</Label>
            <Input
              id="senderName"
              type="text"
              placeholder="Enter sender name"
              {...register("senderName")}
              className="rounded-sm"
            />
            {errors.senderName && (
              <p className="text-xs text-red-500">
                {errors.senderName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="text"
              placeholder="Enter contact phone"
              {...register("contactPhone")}
              className="rounded-sm"
            />
            {errors.contactPhone && (
              <p className="text-xs text-red-500">
                {errors.contactPhone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pickup Information */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Pickup Information</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <Input
              id="pickupDate"
              type="date"
              placeholder="Enter pickup date"
              {...register("pickupDate")}
              className="rounded-sm"
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-500">
                {errors.pickupDate.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input
              id="pickupTime"
              type="time"
              placeholder="Enter pickup time"
              {...register("pickupTime")}
              className="rounded-sm"
            />
            {errors.pickupTime && (
              <p className="text-xs text-red-500">
                {errors.pickupTime.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <Button type="button" className="rounded-sm">
            Pick Location Here
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="pickupAddress">Pickup Address</Label>
            <Input
              id="pickupAddress"
              type="text"
              placeholder="Enter pickup address"
              {...register("pickupAddress")}
              className="rounded-sm"
            />
            {errors.pickupAddress && (
              <p className="text-xs text-red-500">
                {errors.pickupAddress.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickupCity">Pickup City</Label>
            <Input
              id="pickupCity"
              type="text"
              placeholder="Enter pickup city"
              {...register("pickupCity")}
              className="rounded-sm"
            />
            {errors.pickupCity && (
              <p className="text-xs text-red-500">
                {errors.pickupCity.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pickupGeoCoordinate">Pickup Geo Coordinate</Label>
          <Input
            id="pickupGeoCoordinate"
            type="text"
            placeholder="e.g., 34.0522,-118.2437"
            {...register("pickupGeoCoordinate")}
            className="rounded-sm"
          />
          {errors.pickupGeoCoordinate && (
            <p className="text-xs text-red-500">
              {errors.pickupGeoCoordinate.message}
            </p>
          )}
        </div>
      </div>

      {/* Receiver Data */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Receiver Data</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="receiverName">Receiver Name</Label>
            <Input
              id="receiverName"
              type="text"
              placeholder="Enter receiver name"
              {...register("receiverName")}
              className="rounded-sm"
            />
            {errors.receiverName && (
              <p className="text-xs text-red-500">
                {errors.receiverName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="receiverPhone">Receiver Phone</Label>
            <Input
              id="receiverPhone"
              type="text"
              placeholder="Enter receiver phone"
              {...register("receiverPhone")}
              className="rounded-sm"
            />
            {errors.receiverPhone && (
              <p className="text-xs text-red-500">
                {errors.receiverPhone.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">Drop-Off Information</p>
            <div className="relative flex items-center">
              <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
              <Separator className="dark:bg-white" />
            </div>
          </div>
          <div>
            <Button type="button" className="rounded-sm">
              Pick Location Here
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Input
                id="deliveryAddress"
                type="text"
                placeholder="Enter delivery address"
                {...register("deliveryAddress")}
                className="rounded-sm"
              />
              {errors.deliveryAddress && (
                <p className="text-xs text-red-500">
                  {errors.deliveryAddress.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deliveryCity">Delivery City</Label>
              <Input
                id="deliveryCity"
                type="text"
                placeholder="Enter delivery city"
                {...register("deliveryCity")}
                className="rounded-sm"
              />
              {errors.deliveryCity && (
                <p className="text-xs text-red-500">
                  {errors.deliveryCity.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="deliveryGeoCoordinate">
              Delivery Geo Coordinate
            </Label>
            <Input
              id="deliveryGeoCoordinate"
              type="text"
              placeholder="e.g., 34.0522,-118.2437"
              {...register("deliveryGeoCoordinate")}
              className="rounded-sm"
            />
            {errors.deliveryGeoCoordinate && (
              <p className="text-xs text-red-500">
                {errors.deliveryGeoCoordinate.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Item(S) to be Shipped</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-6">
            <div className="grid gap-2">
              <Label htmlFor="pkgWeight">Weight (kg)</Label>
              <Input
                id="pkgWeight"
                type="text"
                name="weight"
                value={pkg.weight}
                onChange={handlePackageChange}
                placeholder="Weight"
                className="rounded-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkgLength">Length (L)</Label>
              <Input
                id="pkgLength"
                type="text"
                step="1"
                name="length"
                value={pkg.length}
                onChange={handlePackageChange}
                placeholder="Length (cm)"
                className="rounded-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkgHeight">Height (H)</Label>
              <Input
                id="pkgHeight"
                type="text"
                name="height"
                value={pkg.height}
                onChange={handlePackageChange}
                placeholder="Height (cm)"
                className="rounded-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pkgWidth">Width</Label>
              <Input
                id="pkgWidth"
                type="text"
                name="width"
                value={pkg.width}
                onChange={handlePackageChange}
                placeholder="Width (cm)"
                className="rounded-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pkgQuantity">Quantity</Label>
              <Input
                id="pkgQuantity"
                type="text"
                name="quantity"
                value={pkg.quantity}
                onChange={handlePackageChange}
                placeholder="Quantity"
                className="rounded-sm"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pkgDescription">Description</Label>
            <Textarea
              id="pkgDescription"
              name="description"
              value={pkg.description}
              onChange={(e) =>
                setPkg((prev) => ({
                  ...prev,
                  description: e.target.value as any,
                }))
              }
              placeholder="Description"
              className="rounded-sm"
            />
          </div>
          <div className="text-left">
            <Button
              type="button"
              onClick={addPackage}
              variant="default"
              className="rounded-sm"
            >
              Add Package
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">List of Items/Packages</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
          {packagesList.length > 0 && (
            <ul className="">
              {packagesList.map((pkg, index) => {
                const dimension = calculateShippingCost([{ ...pkg }]);
                return (
                  <li key={index} className="flex items-center">
                    <ItemCard
                      description={pkg.description}
                      item={index + 1}
                      dimension={dimension}
                      quantity={pkg.quantity}
                      handleRemove={() => removePackage(index)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 w-full">
        <Button
          type="submit"
          size="lg"
          variant="default"
          className="w-full rounded-sm"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Shipment"
          )}
        </Button>
      </div>
    </form>
  );
};
