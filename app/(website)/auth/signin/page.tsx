"use client";

import { LoginForm } from "@/components/Auth/login-form";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

// Wrap the component content in Suspense
function LoginContent() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("reason") === "expired";

  useEffect(() => {
    if (expired) {
      toast.error("Session expired, Please log in again");
    }
  }, [expired]);

  return (
    <div className="mt-24 grid min-h-screen place-content-center">
      <div className="flex flex-col gap-4 p-6 shadow-md md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
