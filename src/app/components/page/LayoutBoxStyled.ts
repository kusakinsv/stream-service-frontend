import { Box, styled } from "@mui/material";

export const LayoutBoxStyled = styled(Box)(() => ({
  display: 'flex',
  height: '100vh',
  maxHeight: '100vh',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}));