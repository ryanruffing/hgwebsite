// theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "Arial, sans-serif",
      },
      button: {
        color: "#ff4e00",
      },
    },
  },
});

export default theme;
