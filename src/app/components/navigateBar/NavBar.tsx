import type { PropsWithChildren } from "react";

import { useTheme, useMediaQuery } from "@mui/material";

import { MobileBar } from "@/app/components/navigateBar/components/MobileBar.tsx";
import { DesktopBar } from "@/app/components/navigateBar/components/DesktopBar.tsx";


export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const navItems: NavItem[] = [
  { label: "Моя музыка", path: "/library", icon: "1" },
  { label: "Поиск музыки", path: "/search", icon: "2" },
];

export const NavBar  = ({ children }: PropsWithChildren) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return <MobileBar>
      {children}
    </MobileBar>
  }

  return (
    <>
      <DesktopBar/>
      {children}
    </>
  );

};