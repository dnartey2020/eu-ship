import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/",
  },
  {
    id: 2,
    title: "Tracking",
    newTab: false,
    path: "/tracking",
  },
  {
    id: 3,
    title: "Services",
    newTab: false,
    path: "/services",
  },
  {
    id: 3,
    title: "Resources",
    newTab: false,
    submenu: [
      // {
      //   id: 31,
      //   title: "Help Center",
      //   newTab: false,
      //   path: "/help-center",
      // },
      {
        id: 7,
        title: "Support",
        newTab: false,
        path: "/support",
      },
    ],
  },

  {
    id: 4,
    title: "Support",
    newTab: false,
    path: "/support",
  },
];

export default menuData;
