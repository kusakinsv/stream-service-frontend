import type { PropsWithChildren } from "react";

import { useLocation, useNavigate } from "react-router";
import { Paper, AppBar, useTheme, BottomNavigation, BottomNavigationAction } from "@mui/material";

import { navItems } from "@/app/components/navigateBar/NavBar.tsx";

export const MobileBar = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const currentPath = location.pathname;

  const activeIndex = navItems.findIndex((item) => item.path === currentPath);

  return (
    <>
    <AppBar position="sticky" color="primary" elevation={2} sx={{ display: { xs: "flex", md: "none" } }}>
    </AppBar>
    {children}


    {/*<Paper*/}
    {/*  sx={{*/}
    {/*    // position: "fixed",*/}
    {/*    // bottom: 0,*/}
    {/*    // left: 0,*/}
    {/*    // right: 0,*/}
    {/*    // zIndex: theme.zIndex.appBar,*/}
    {/*    // display: { xs: "block", md: "none" },*/}
    {/*  }}*/}
    {/*  elevation={3}*/}
    {/*>*/}
      <BottomNavigation
        value={activeIndex !== -1 ? activeIndex : 0}
        onChange={(_, newValue) => {
          handleNavigation(navItems[newValue].path);
        }}
        showLabels
        sx={{
          // marginTop: 12,
          height: 45,
          "& .MuiBottomNavigationAction-root": {
            minWidth: "auto",
            // padding: "6px 12px",
          },
        }}
      >

        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
            sx={{
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            }}
          />
        ))}
      </BottomNavigation>

    {/*</Paper>*/}
  </>
  );
};