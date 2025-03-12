import image1 from "@/public/images/user/user-01.jpg";
import image2 from "@/public/images/user/user-02.jpg";
import image3 from "@/public/images/user/user-03.jpg";

import { Testimonial } from "@/types/testimonial";

export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Devid Smith",
    designation: "Founter @democompany",
    image: image3,
    content:
      "Our shipping process has been transformed. The platform’s real-time tracking and seamless integrations have significantly boosted our operational efficiency.",
  },
  {
    id: 2,
    name: "Jhon Abraham",
    designation: "Founter @democompany",
    image: image2,
    content:
      "With unparalleled security and transparent tracking, our supply chain operations have never been smoother. This system truly sets the standard for modern logistics.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    designation: "COO @ TransGlobal",
    image: image1,
    content:
      "The innovative integration features and live updates have empowered us to make informed decisions quickly. It’s a game-changer for our international shipments.",
  },
  // {
  //   id: 4,
  //   name: "Michael Brown",
  //   designation: "CEO @ FleetForward",
  //   image: image2,
  //   content:
  //     "Since adopting this logistics solution, our delivery times have improved dramatically. Our customers now enjoy reliable, on-time shipments every time.",
  // },
];
