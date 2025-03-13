"use client";
import Image from "next/image";

import { TrackShipmentBtn } from "../Tracking/track-shipment-btn";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <>
      <section className="overflow-hidden pb-10 pt-35 md:pt-40 xl:pb-25 xl:pt-32">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className=" md:w-1/2">
              <h4 className="mb-4.5 text-lg font-medium text-black dark:text-white">
                🔥 Welcome to Euroswift Logistics
              </h4>
              <h1 className="mb-5 pr-16 text-3xl font-bold text-black dark:text-white xl:text-hero ">
                Track Your Shipment {"   "}
                <span className="relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full before:bg-titlebg dark:before:bg-titlebgdark ">
                  Effortlessly
                </span>
              </h1>
              <p>
                Our advanced logistics platform provides real-time tracking,
                secure integrations, and complete transparency—from dispatch to
                delivery. Monitor your cargo anytime, anywhere.
              </p>

              <div className="mt-10">
                <TrackShipmentBtn />

                <p className="mt-5 text-black dark:text-white">
                  Get real-time updates instantly—no registration required.
                </p>
              </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <div className="relative 2xl:-mr-7.5">
                <Image
                  src="/images/shape/shape-01.png"
                  alt="shape"
                  width={46}
                  height={246}
                  className="absolute -left-11.5 top-0"
                />
                <Image
                  src="/images/shape/shape-02.svg"
                  alt="shape"
                  width={36.9}
                  height={36.7}
                  className="absolute bottom-0 right-0 z-10"
                />
                <Image
                  src="/images/shape/shape-03.svg"
                  alt="shape"
                  width={21.64}
                  height={21.66}
                  className="absolute -right-6.5 bottom-0 z-1"
                />
                <div className=" relative aspect-[800/544] w-full">
                  <Image
                    className=""
                    src="/images/hero/shape.png"
                    alt="Hero"
                    fill
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                fetch("/api/testing", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: "test@example.com",
                    password: "securepassword",
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => console.log(data))
                  .catch((err) => console.error(err));
              }}
            >
              click here
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
