import type { PropsWithChildren } from "react";

import { styled, Container } from "@mui/material";

export const ContentStyled = styled(Container)(() => ({
  flex: 1,
  flexGrow: 1,
  minHeight: 0,
  maxWidth: 'md',
  height: "100%",
  padding: "0.2rem",
"&.MuiContainer-maxWidthLg": {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem",
  paddingBottom: 0,
  overflow: 'auto',
  // скрываем скролл
  scrollbarWidth: 'none', // Firefox
  msOverflowStyle: 'none', // IE/Edge
}
}));

export const Content = ({children}: PropsWithChildren) => {
  return <ContentStyled id="content-container">
    {children}
  </ContentStyled>;
}