"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

const data = [
  {
    title: "Account Setting",
    href: "/account-setting",
  },
  {
    title: "Shipment History",
    href: "/shipping-history",
  },
  {
    title: "Payment History",
    href: "/payment-history",
  },
  {
    title: "Default Pickup Location",
    href: "/default-pickup-location",
  },
];

const AuthenticadUserLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="overflow-hidden px-4 pb-10 pt-30 lg:px-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <div className="hidden lg:col-span-1 lg:block">
          <div className="rounded-md bg-cyan-500 p-8">
            <ul className="flex flex-col gap-3 ">
              {data.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li
                    key={index}
                    className={cn(
                      "flex w-full items-center justify-center rounded-sm border-2 py-2 text-white shadow",
                      isActive && "border-transparent bg-white text-black",
                    )}
                  >
                    <Link
                      href={item.href}
                      className="w-full text-center text-sm font-semibold"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="px-4 lg:col-span-3">{children}</div>
      </div>
    </div>
  );
};

export default AuthenticadUserLayout;
