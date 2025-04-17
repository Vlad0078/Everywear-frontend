import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
  },
  typography: {
    fontFamily: '"Inter", "Outfit", "Montserrat"',
    // h1: { fontSize: '2rem', fontWeight: 600 },
    // h2: { fontSize: '1.5rem', fontWeight: 500 },
    // body1: { fontSize: '1rem', lineHeight: 1.5 },
    // button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
          "& .MuiInputBase-input": {
            color: "#000000", // primary
          },
          "& .MuiFormLabel-asterisk": {
            display: "none", // hide asterisk
          },
          "& .MuiFormLabel-root": {
            color: grey[500], // placeholder color
          },
          input: {
            color: "#ff0000",
          },
        },
      },
    },
  },
});

export default theme;
