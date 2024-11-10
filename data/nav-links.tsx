import { BarChart, HomeIcon, List } from "lucide-react";

export const navLinksData: { name: string; href: string; icon: JSX.Element }[] =
  [
    {
      name: "Dashboard",
      href: "/dashboard/weather-news",
      icon: <HomeIcon />,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart />,
    },
    {
      name: "Kanban",
      href: "/dashboard/kanban",
      icon: <List />,
    },
  ];
