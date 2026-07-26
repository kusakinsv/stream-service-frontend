import type { PropsWithChildren } from "react";

import { useTheme, useMediaQuery } from "@mui/material";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

import { MobileBar } from "@/app/components/navigateBar/components/MobileBar.tsx";
import { DesktopBar } from "@/app/components/navigateBar/components/DesktopBar.tsx";


export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const libraryIcon = <LibraryMusicIcon fontSize="large"/>
const searchIcon = <ManageSearchIcon sx={{fontSize: "2.8rem"}}/>


export const navItems: NavItem[] = [
  { label: "Моя музыка", path: "/library", icon: libraryIcon },
  { label: "Поиск музыки", path: "/search", icon: searchIcon },
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