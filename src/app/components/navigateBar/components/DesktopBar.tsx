import { useNavigate } from "react-router";
import { Box, AppBar, Toolbar, IconButton } from "@mui/material";

import { getColors } from "@/app/theme/colors.ts";
import { navItems } from "@/app/components/navigateBar/NavBar.tsx";

export const DesktopBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
          <IconButton
            size="large"
            edge="start"
            sx={{ mr: 2 }}
            color="inherit"
            aria-label="menu"
          >
            Logo
          </IconButton>

          <Box sx={{
            display: "flex",
            gap: 3,
            justifyContent: "space-between",
          }}
          >
            {navItems.map((item) => (
              <IconButton
                key={item.path}
                color="inherit"
                onClick={() => handleNavigation(item.path)}
                sx={{
                  margin: "0 1rem",
                  color: location.pathname === item.path ? getColors().blue.light : getColors().grey.light,
                  fontWeight: location.pathname === item.path ? 500 : 400,
                  "&:hover": {
                    color: location.pathname === item.path ? getColors().blue.light : getColors().white.main,
                  },
                }}
              >
                {item.label}
              </IconButton>
            ))}
            <Box sx={{ width: 0, flexShrink: 0 }} />
          </Box>
          <Box sx={{ width: 0, flexShrink: 0 }} />
        </Toolbar>
    </AppBar>
  );
};