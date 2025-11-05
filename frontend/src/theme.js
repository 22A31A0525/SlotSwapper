import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6C63FF", // A modern, vibrant violet
      light: "#9c98ff",
      dark: "#3f3cbb",
    },
    secondary: {
      main: "#00C9A7", // A fresh teal for accents (like 'swappable' status)
    },
    background: {
      default: "#F4F6F8", // Light gray background instead of pure white
      paper: "#ffffff",
    },
    text: {
      primary: "#2D3748", // Softer black for better readability
      secondary: "#718096",
    },
  },
  shape: {
    borderRadius: 16, // Much rounder corners for a friendly, modern look
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // (Optional: requires installing font)
    h4: {
      fontWeight: 700,
      color: "#1A202C",
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Removes all-caps from buttons for a cleaner look
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", // Soft, expensive-looking shadow
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Consistent rounded buttons
          padding: "10px 24px",
        },
        containedPrimary: {
          boxShadow: "0px 4px 14px rgba(108, 99, 255, 0.4)", // Glowing shadow for primary buttons
          "&:hover": {
            boxShadow: "0px 6px 20px rgba(108, 99, 255, 0.6)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#ffffff",
          color: "#2D3748",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)", // Minimalist navbar shadow
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default theme;
