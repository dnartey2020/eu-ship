"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const UserAvatar = () => {
  const router = useRouter();

  const { user, clearAuth } = useAuthStore();
  const z = user?.name.split(" ");
  const fallbackName = z?.map((a) => a[0]);
  const avatarName = fallbackName?.join("");

  const handleLogout = async () => {
    clearAuth();
    router.push("/auth/signin");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div className=" relative flex cursor-pointer flex-row items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn." alt="@shadcn" />
            <AvatarFallback>{avatarName}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm">{user?.name}</span>
            <span className="text-muted-foreground text-xs">{user?.email}</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem className="text-sm">
            <Link href={"/shipping-history"}>My Shipment</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-sm" asChild>
            <Link href={"/account-setting"}>Account Settings</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
