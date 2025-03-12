import React from "react";

function Page() {
  return (
    <div className="mt-35 px-10 pb-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="col-span-1 grid gap-5">
          <div className="h-44 rounded-sm bg-[#2effbd] p-8 text-black">
            <p className="mb-5 text-xl font-bold">Our Services</p>
            <div className=" bg-white px-4 py-2 text-center shadow-md">
              <p>Express Courier Services</p>
            </div>
          </div>
          <div className="h-60 rounded-sm bg-[#2effbd] p-8 text-black">
            <p className="mb-5 text-xl font-bold">Perfect For: </p>
            <div className="grid gap-2 text-sm">
              <div className=" bg-white px-4 py-2 ">
                <p>Important documents and contracts</p>
              </div>
              <div className=" bg-white px-4 py-2 ">
                <p>Perishable items</p>
              </div>
              <div className=" bg-white px-4 py-2 ">
                <p>Time-sensitive business needs</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className=" mb-8 grid gap-4">
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="text-base font-light text-waterloo">
              Euroswrift is your go-to solution for urgent shipments. We
              understand that sometimes speed is everything. That's why we offer
              guaranteed delivery times within your city or region, ensuring
              your package arrives quickly and reliably.
            </p>
          </div>
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold">How it Works?</h2>
            <div className="grid gap-4">
              <p className="text-base font-light text-waterloo">
                Getting started with Euroswrift Express Courier Service is easy:
              </p>
              <p className="text-base font-light text-waterloo">
                <span className="font-semibold">Get a Quote: </span>Enter your
                package details and destination on our website or app. We'll
                provide instant quotes and estimated delivery times for various
                options.
              </p>
              <p className="text-base font-light text-waterloo">
                <span className="font-semibold">Book Your Delivery: </span>
                Choose the option that best suits your needs and budget.
                Schedule your pickup at your convenience.
              </p>
              <p className="text-base font-light text-waterloo">
                <span className="font-semibold">Track Your Package: </span>Relax
                and monitor your shipment's progress in real time using our
                user-friendly tracking system.
              </p>
              <p className="text-base font-light text-waterloo">
                <span className="font-semibold">Delivery Confirmation: </span>
                Receive a notification once your package is delivered securely
                to its destination.
              </p>
              <p className="text-base font-light text-waterloo">
                Ready to experience the speed and reliability of Euroswrift
                Express Courier Services? Get a free quote online in just
                minutes and ensure your urgent shipment arrives on time, every
                time. Choose FC Express's Express Courier Services – because
                sometimes, speed truly matters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
