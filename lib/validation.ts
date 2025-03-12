// lib/validation.ts
import { ShipmentStatus } from "@/models/shipment-model";
import * as z from "zod";

export const shipmentSchema = z.object({
  sender: z.object({
    name: z.string().min(1, "Sender name is required"),
    address: z.string().min(1, "Sender address is required"),
    city: z.string().min(1, "Sender city is required"),
    postalCode: z.string().min(3, "Valid postal code required"),
    country: z.string().min(2, "Country code required"),
    phone: z.string().min(5, "Valid phone number required"),
  }),
  receiver: z.object({
    name: z.string().min(1, "Receiver name is required"),
    address: z.string().min(1, "Receiver address is required"),
    city: z.string().min(1, "Receiver city is required"),
    postalCode: z.string().min(3, "Valid postal code required"),
    country: z.string().min(2, "Country code required"),
    phone: z.string().min(5, "Valid phone number required"),
  }),
  serviceType: z.enum(["STANDARD", "EXPRESS", "INTERNATIONAL"]),
  specialInstructions: z.string().optional(),
  status: z
    .nativeEnum(ShipmentStatus)
    .optional()
    .default(ShipmentStatus.PENDING),
});

export const packageCreateSchema = z.object({
  weight: z.number().positive("Weight must be greater than zero"),
  dimensions: z
    .string()
    .regex(
      /^\d+x\d+x\d+$/,
      "Dimensions must be in LxWxH format (e.g., 10x20x30)",
    ),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const packageCreateArraySchema = z.array(packageCreateSchema);

export const shipmentWithPackagesSchema = shipmentSchema.extend({
  packages: z
    .array(packageCreateSchema)
    .min(1, "At least one package is required"),
});

const ServiceTypeEnum = z.enum(["STANDARD", "EXPRESS", "INTERNATIONAL"]);
export type ServiceType = z.infer<typeof ServiceTypeEnum>;

export type shipmentWithPackagesSchemaData = z.infer<
  typeof shipmentWithPackagesSchema
>;
