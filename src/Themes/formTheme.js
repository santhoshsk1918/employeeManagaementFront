import {
    indigo,
    brown,
    green
  } from "@material-ui/core/colors";
  import { createTheme } from "@material-ui/core/styles";
  
  const formTheme = createTheme({
    palette: {
      primary: indigo,
      secondary: brown,
      success: green
    },
  });
  
  export default formTheme;
  