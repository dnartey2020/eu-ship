"use client";

import { TrackShipmentBtn } from "@/components/Tracking/track-shipment-btn";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  trackingNumber: z.string(),
});

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <div className=" flex min-h-screen items-center px-10">
      <div className="grid grid-cols-1 place-content-center gap-10 lg:grid-cols-3">
        <div className="col-span-1 grid gap-16 rounded-md bg-[#296CFF] p-5 text-white lg:p-10">
          <div className="grid gap-5">
            <p className="text-2xl font-semibold lg:text-2xl">
              Don't Have a Tracking Number?
            </p>
            <p className="text-sm">
              Need to schedule a new delivery or shipment? Head over to our
              create shipment page to get started! In just a few clicks, you can
              obtain a free quote tailored to your specific delivery needs
            </p>
          </div>
          <Button
            variant={"outline"}
            size={"lg"}
            className="border-2 bg-transparent"
          >
            Get Started
          </Button>
        </div>
        <div className=" grid rounded-md  lg:col-span-2">
          <div className="flex flex-col gap-10">
            <p className="text-gray-400">
              Enter your tracking number below to get real-time updates on the
              location and status of your delivery. We provide a user-friendly
              interface for you to monitor your package's journey every step of
              the way, from pickup to successful delivery. Have peace of mind
              knowing exactly when your package will arrive!
            </p>
            <TrackShipmentBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
