import { Metadata } from "next";
import Hero from "@/components/Hero";
import Feature from "@/components/Features";
import About from "@/components/About";
import FunFact from "@/components/FunFact";
import FAQ from "@/components/FAQ";

import Testimonial from "@/components/Testimonial";

export const metadata: Metadata = {
  title: "Euroswift Logistics",

  // other metadata
  description: "shipping item globally",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Feature />
      <About />
      <FunFact />
      <FAQ />
      <Testimonial />
    </main>
  );
}
