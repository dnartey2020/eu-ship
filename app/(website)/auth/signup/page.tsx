"use client";
import { SignUpForm } from "@/components/Auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="mt-24 grid min-h-screen place-content-center pb-20  ">
      <div className="flex flex-col gap-4 p-6 shadow-md  md:p-10">
        <div className="flex w-full flex-1">
          <div className="w-full max-w-lg">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
