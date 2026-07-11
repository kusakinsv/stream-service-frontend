import { styled, Container } from "@mui/material";

export const Content = styled(Container)(() => ({
  py: 2,
  flexGrow: 1,
  minHeight: 0,
  maxWidth: 'md',
  maxHeight: "100%",
  // height: "100%",
  padding: "0.2rem",
"&.MuiContainer-maxWidthLg": {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem",
}
}));