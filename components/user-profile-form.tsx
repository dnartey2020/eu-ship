import React from "react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const UserProfileForm = () => {
  return (
    <form className={cn("flex h-full flex-col gap-6")}>
      <div className="grid gap-6">
        {/* Personal Information */}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Account Profile</p>
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
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Enter your lastname"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold">Change Password</p>
          <div className="relative flex items-center">
            <div className="absolute h-1 w-60 bg-black dark:bg-primaryho" />
            <Separator className="dark:bg-white" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="currentpassword">Current Password</Label>
          <Input
            id="currentpassword"
            type="password"
            placeholder="Enter your current password"
          />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="newpassword">New Password</Label>
            <Input
              id="newmpassword"
              type="password"
              placeholder="New password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastname">Confirm New Password</Label>
            <Input
              id="confirmnewpassword"
              type="text"
              placeholder="Enter your Confirm New Password"
            />
          </div>
        </div>

        <Button type="submit" size={"lg"} className={cn("w-48")}>
          Update Account
        </Button>
      </div>
    </form>
  );
};
