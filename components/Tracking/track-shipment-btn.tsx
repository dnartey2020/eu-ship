"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  trackingNumber: z.string(),
});
export const TrackShipmentBtn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trackingNumber: "",
    },
  });

  const onSubmit = (value: z.infer<typeof formSchema>) => {
    router.push(`/tracking/${value.trackingNumber}`);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <Label className="font-semibold">Tracking Number</Label>
        <div>
          <div className="flex items-center  rounded-md border-2 px-2 dark:border-white dark:bg-black">
            <input
              className="flex flex-1 px-3 py-3 text-sm outline-none ring-0  dark:bg-black"
              placeholder="Enter Tracking Number"
              {...register("trackingNumber")}
            />
          </div>
          {errors.trackingNumber && (
            <span className="text-sm text-rose-500">
              {errors.trackingNumber.message}
            </span>
          )}
        </div>
        <Button
          size={"lg"}
          type="submit"
          className="bg-blue-500 text-white dark:hover:text-black"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin " />
          ) : (
            "Track Shipment"
          )}
        </Button>
      </div>
    </form>
  );
};
