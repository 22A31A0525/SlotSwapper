import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import MarketplacePage from "./pages/MarketplacePage";
import RequestsPage from "./pages/RequestsPage";
import Navbar from "./components/Navbar";
// 1. Imports are correct
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

const PrivateRoute = () => {
  const token = localStorage.getItem("jwt_token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    // 2. ThemeProvider goes OUTSIDE of everything else
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/requests" element={<RequestsPage />} />
            </Route>
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
