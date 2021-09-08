import {
  deepOrange,
  lightGreen,
  orange,
  red,
  purple,
  amber,
} from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

const baseTheme = createTheme({
  palette: {
    primary: deepOrange,
    secondary: amber,
    error: red,
    warning: purple,
    info: orange,
    success: lightGreen,
    text: {
      secondary: "#990000",
      info: "#0000b3" 
    }
  }
});

export default baseTheme;
