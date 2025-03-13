// lib/validation.ts
import * as z from "zod";

export const shipmentSchema = z.object({
  senderName: z.string().nonempty("Sender name is required"),
  contactPhone: z.string().nonempty("Contact phone is required"),
  pickupAddress: z.string().nonempty("Pickup address is required"),
  pickupCity: z.string().nonempty("Pickup city is required"),
  pickupGeoCoordinate: z.string().nonempty("Pickup geo coordinate is required"),
  pickupDate: z.coerce.date(),
  pickupTime: z.string().optional(),
  receiverName: z.string().nonempty("Receiver name is required"),
  receiverPhone: z.string().nonempty("Receiver phone is required"),
  deliveryAddress: z.string().nonempty("Delivery address is required"),
  deliveryCity: z.string().nonempty("Delivery city is required"),
  deliveryGeoCoordinate: z
    .string()
    .nonempty("Delivery geo coordinate is required"),
  estimatedCost: z.number().min(0, "Estimated cost must be non-negative"),
  packages: z.array(
    z.object({
      weight: z.number().min(0.1, "Weight must be positive"),
      length: z.number().min(0.1, "length must be positive"),
      description: z.string().nonempty("Description are required"),
      quantity: z.number().min(1, "Quantity must be positive").int(),
      width: z.number().min(1, "Width must be positive").int(),
      height: z.number().min(1, "Height must be positive").int(),
    }),
  ),
});
