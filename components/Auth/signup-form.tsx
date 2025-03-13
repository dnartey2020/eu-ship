"use client";

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/lib/auth/utils";
import { SignUpFormValues, signUpSchema } from "./schema";

// Define a Zod schema for the form fields

// Infer the TypeScript type from the schema

export function SignUpForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      // On successful login, redirect to the dashboard
      router.push("/auth/signin");
    },
    onError: (error: any) => {
      alert("Error: " + error.message);
    },
  });
  // Set up react-hook-form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      pickaddress: "",
      pickcity: "",
      picklocation: "",
      password: "",
      comfirmpassword: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = (data) => {
    console.log(data);

    mutation.mutate(data);
  };

  return (
    <form
      className={cn("flex flex-col gap-6")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-balance text-sm">
          Enter your information below to create a new account
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Information */}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Personal Information</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-50 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="Enter your firstname"
              // Bind to react-hook-form
              {...register("firstname")}
            />
            {errors.firstname && (
              <p className="text-xs text-red-500">{errors.firstname.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Enter your lastname"
              {...register("lastname")}
            />
            {errors.lastname && (
              <p className="text-xs text-red-500">{errors.lastname.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phonenumber">Phone number</Label>
          <Input
            id="phonenumber"
            type="tel"
            maxLength={10}
            placeholder="Enter phone number"
            {...register("phonenumber")}
          />
          {errors.phonenumber && (
            <p className="text-xs text-red-500">{errors.phonenumber.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comfirmpassword">Confirm Password</Label>
          <Input
            id="comfirmpassword"
            type="password"
            placeholder="Confirm password"
            {...register("comfirmpassword")}
          />
          {errors.comfirmpassword && (
            <p className="text-xs text-red-500">
              {errors.comfirmpassword.message}
            </p>
          )}
        </div>

        {/* Default Pickup Location */}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Set Default Pickup Location</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-60 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div>
          <Button
            className="flex items-center"
            type="button"
            variant={"outline"}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Pick Location Here
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="col-span-2 grid gap-2">
            <Label htmlFor="pickaddress">Pick Address</Label>
            <Input
              id="pickaddress"
              type="text"
              placeholder="Address"
              {...register("pickaddress")}
            />
            {errors.pickaddress && (
              <p className="text-xs text-red-500">
                {errors.pickaddress.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickcity">Pick City</Label>
            <Input
              id="pickcity"
              type="text"
              placeholder="City"
              {...register("pickcity")}
            />
            {errors.pickcity && (
              <p className="text-xs text-red-500">{errors.pickcity.message}</p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="picklocation">Pick Up Location Geo Coordinate</Label>
          <Input
            id="picklocation"
            type="text"
            placeholder="Location"
            {...register("picklocation")}
          />
          {errors.picklocation && (
            <p className="text-xs text-red-500">
              {errors.picklocation.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/signin" className="underline underline-offset-4">
          Log In
        </a>
      </div>
    </form>
  );
}
