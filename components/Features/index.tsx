"use client";
import React from "react";
import featuresData from "./featuresData";
import SingleFeature from "./SingleFeature";
import SectionHeader from "../Common/SectionHeader";

const Feature = () => {
  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section
        id="features"
        className="px-4 py-20 md:px-8 lg:py-25 xl:px-8 xl:py-30"
      >
        <div className="mx-auto max-w-c-1315 ">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "SOLID FEATURES",
              subtitle: "Core Features of Solid",
              description: `Streamlined solutions for secure, real-time shipping
Empowering your logistics with intuitive, integrated features`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
            {/* <!-- Features item Start --> */}

            {featuresData.map((feature, key) => (
              <SingleFeature feature={feature} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Feature;
