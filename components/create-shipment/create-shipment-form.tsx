"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shipmentWithPackagesSchema,
  shipmentWithPackagesSchemaData,
} from "@/lib/validation";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useCreateShipment } from "@/hooks/use-create-shipment";
import { useRouter } from "next/navigation";
import { ItemCard } from "./item-card";
import { calculateShippingCost } from "@/lib/cost-of-package";

type PackageData = {
  weight: number;
  dimensions: string;
  description: string;
  quantity: number;
};

export const CreateShipmentForm = () => {
  const { mutate, isPending } = useCreateShipment();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<shipmentWithPackagesSchemaData>({
    // resolver: zodResolver(shipmentWithPackagesSchema),
  });

  const [pkg, setPkg] = useState<PackageData>({
    weight: 0,
    dimensions: "",
    description: "",
    quantity: 1,
  });

  const [packagesList, setPackagesList] = useState<PackageData[]>([]);

  const handlePackageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPkg((prev) => {
      if (name === "dimensions") {
        return { ...prev, [name]: value };
      }
      return {
        ...prev,
        [name]: name === "description" ? value : Number(value),
      };
    });
  };

  const validateDimensions = (dimensions: string) => {
    return /^\d+x\d+x\d+$/.test(dimensions);
  };

  const addPackage = () => {
    // Validate dimensions format
    const dimensionParts = pkg.dimensions.split("x");
    if (
      dimensionParts.length !== 3 ||
      dimensionParts.some((part) => isNaN(Number(part)) || Number(part) <= 0)
    ) {
      toast.error("Invalid dimensions format. Use LxWxH (e.g., 10x20x30)");
      return;
    }

    if (pkg.weight <= 0 || pkg.quantity <= 0 || !pkg.description.trim()) {
      toast.error("Please fill all required package fields");
      return;
    }

    const newPackage = {
      ...pkg,
      dimensions: pkg.dimensions, // Already validated format
    };

    setPackagesList((prev) => [...prev, newPackage]);
    setValue("packages", [...packagesList, newPackage]);

    setPkg({
      weight: 0,
      dimensions: "",
      description: "",
      quantity: 1,
    });
  };

  const removePackage = (index: number) => {
    const updatedPackages = packagesList.filter((_, i) => i !== index);
    setPackagesList(updatedPackages);
    setValue("packages", updatedPackages);
  };

  const handleFormSubmit: SubmitHandler<shipmentWithPackagesSchemaData> = (
    data,
  ) => {
    if (data.packages.length === 0) {
      toast.warning("Please add at least one package.");
      return;
    }

    mutate(data, {
      onSuccess: () => {
        toast.success("Shipment created successfully!");
        router.push("/shipping-history");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create shipment");
        console.table(err.message);
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
          <Separator />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="sender.name">Sender Name</Label>
            <Input
              id="sender.name"
              {...register("sender.name")}
              placeholder="Sender's full name"
            />
            {errors.sender?.name && (
              <p className="text-xs text-red-500">
                {errors.sender.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender.address">Sender Address</Label>
            <Input
              id="sender.address"
              {...register("sender.address")}
              placeholder="Street address"
            />
            {errors.sender?.address && (
              <p className="text-xs text-red-500">
                {errors.sender.address.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender.city">Sender City</Label>
            <Input
              id="sender.city"
              {...register("sender.city")}
              placeholder="City"
            />
            {errors.sender?.city && (
              <p className="text-xs text-red-500">
                {errors.sender.city.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender.postalCode">Postal Code</Label>
            <Input
              id="sender.postalCode"
              {...register("sender.postalCode")}
              placeholder="Postal code"
            />
            {errors.sender?.postalCode && (
              <p className="text-xs text-red-500">
                {errors.sender.postalCode.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender.country">Country</Label>
            <Input
              id="sender.country"
              {...register("sender.country")}
              placeholder="Country"
            />
            {errors.sender?.country && (
              <p className="text-xs text-red-500">
                {errors.sender.country.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sender.phone">Phone</Label>
            <Input
              id="sender.phone"
              {...register("sender.phone")}
              placeholder="Phone number"
            />
            {errors.sender?.phone && (
              <p className="text-xs text-red-500">
                {errors.sender.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Receiver Information</p>
          <Separator />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="receiver.name">Receiver Name</Label>
            <Input
              id="receiver.name"
              {...register("receiver.name")}
              placeholder="Receiver's full name"
            />
            {errors.receiver?.name && (
              <p className="text-xs text-red-500">
                {errors.receiver.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receiver.address">Receiver Address</Label>
            <Input
              id="receiver.address"
              {...register("receiver.address")}
              placeholder="Street address"
            />
            {errors.receiver?.address && (
              <p className="text-xs text-red-500">
                {errors.receiver.address.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receiver.city">Receiver City</Label>
            <Input
              id="receiver.city"
              {...register("receiver.city")}
              placeholder="City"
            />
            {errors.receiver?.city && (
              <p className="text-xs text-red-500">
                {errors.receiver.city.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receiver.postalCode">Postal Code</Label>
            <Input
              id="receiver.postalCode"
              {...register("receiver.postalCode")}
              placeholder="Postal code"
            />
            {errors.receiver?.postalCode && (
              <p className="text-xs text-red-500">
                {errors.receiver.postalCode.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receiver.country">Country</Label>
            <Input
              id="receiver.country"
              {...register("receiver.country")}
              placeholder="Country"
            />
            {errors.receiver?.country && (
              <p className="text-xs text-red-500">
                {errors.receiver.country.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="receiver.phone">Phone</Label>
            <Input
              id="receiver.phone"
              {...register("receiver.phone")}
              placeholder="Phone number"
            />
            {errors.receiver?.phone && (
              <p className="text-xs text-red-500">
                {errors.receiver.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Shipping Details */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Shipping Details</p>
          <Separator />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <select
              id="serviceType"
              {...register("serviceType")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="STANDARD">Standard (3-5 business days)</option>
              <option value="EXPRESS">Express (1-2 business days)</option>
              <option value="INTERNATIONAL">
                International (5-10 business days)
              </option>
            </select>
            {errors.serviceType && (
              <p className="text-xs text-red-500">
                {errors.serviceType.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              {...register("specialInstructions")}
              placeholder="Fragile items, temperature requirements, etc."
              className="min-h-[100px]"
            />
            {errors.specialInstructions && (
              <p className="text-xs text-red-500">
                {errors.specialInstructions.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Packages</p>
          <Separator />
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                type="number"
                name="weight"
                value={pkg.weight}
                onChange={handlePackageChange}
                min="0.1"
                step="0.1"
                placeholder="Weight"
              />
              {errors.packages?.[0]?.weight && (
                <p className="text-xs text-red-500">Weight is required</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dimensions">Dimensions (L×W×H cm)</Label>
              <Input
                name="dimensions"
                value={pkg.dimensions}
                onChange={handlePackageChange}
                placeholder="10×20×30"
              />
              {errors.packages?.[0]?.dimensions && (
                <p className="text-xs text-red-500">
                  Valid dimensions required
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                name="quantity"
                value={pkg.quantity}
                onChange={handlePackageChange}
                min="1"
                placeholder="Quantity"
              />
              {errors.packages?.[0]?.quantity && (
                <p className="text-xs text-red-500">Valid quantity required</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={pkg.description}
                onChange={handlePackageChange}
                placeholder="Package description"
              />
              {errors.packages?.[0]?.description && (
                <p className="text-xs text-red-500">Description is required</p>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={addPackage}
            variant="outline"
            className="w-fit"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Package
          </Button>

          {packagesList.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-lg font-semibold">Added Packages</p>
              <div className="grid grid-cols-1 gap-4">
                {packagesList.map((pkg, index) => {
                  const dimension = calculateShippingCost(
                    pkg.weight,
                    pkg.dimensions,
                  );
                  return (
                    <ItemCard
                      key={index}
                      description={pkg.description}
                      item={index + 1}
                      dimension={dimension}
                      quantity={pkg.quantity}
                      handleRemove={() => removePackage(index)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending} className="mt-8 w-full">
        {isPending ? <Loader2 className="animate-spin" /> : "Create Shipment"}
      </Button>
    </form>
  );
};
