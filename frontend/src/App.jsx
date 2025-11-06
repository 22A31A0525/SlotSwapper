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
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import {
  NotificationProvider,
  useNotifications,
} from "./components/NotificationContext";
import { useWebSocket } from "./services/useWebSocket";
const AppLayout = () => {
  const { incrementNotifications, triggerDataRefresh } = useNotifications();

  useWebSocket((message) => {
    let alertText = "Notification Received!";

    if (message === "NEW_REQUEST") {
      alertText = "🔔 New Swap Request Received!";
    } else if (message === "SWAP_ACCEPTED") {
      alertText = "✅ Your swap offer was ACCEPTED!";
    } else if (message === "SWAP_REJECTED") {
      alertText = "❌ Your swap offer was REJECTED.";
    }

    alert(alertText);

    incrementNotifications();
    triggerDataRefresh();
  });

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

// ... PrivateRoute, LoginPage, etc. remain the same ...

function App() {
  const PrivateRoute = () => {
    const token = localStorage.getItem("jwt_token");
    return token ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes (Wrapped in Guard AND Layout) */}
            <Route element={<PrivateRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/requests" element={<RequestsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
