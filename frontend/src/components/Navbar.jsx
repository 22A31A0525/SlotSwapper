import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Badge,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import StorefrontIcon from "@mui/icons-material/StorefrontRounded";
import SwapHorizIcon from "@mui/icons-material/SwapHorizRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { useNotifications } from "./NotificationContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { notificationCount, clearNotifications } = useNotifications();

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/login");
  };

  const handleRequestsClick = () => {
    clearNotifications();
    navigate("/requests");
  };

  const NavButton = ({ to, icon, label, isRequestsButton = false }) => {
    const isActive = location.pathname === to;

    const onClickHandler = isRequestsButton
      ? handleRequestsClick
      : () => navigate(to);

    const buttonIcon = isRequestsButton ? (
      <Badge
        badgeContent={notificationCount}
        color="error"
        max={99}
        sx={{ "& .MuiBadge-badge": { top: 6, right: 0 } }}
      >
        {icon}
      </Badge>
    ) : (
      icon
    );

    return (
      <Button
        startIcon={buttonIcon}
        onClick={onClickHandler}
        sx={{
          mx: 1,
          px: 2,
          color: isActive ? "primary.main" : "text.secondary",
          bgcolor: isActive ? "rgba(108, 99, 255, 0.1)" : "transparent",
          whiteSpace: "nowrap",
          minWidth: "auto",
          "&:hover": { bgcolor: "rgba(108, 99, 255, 0.05)" },
        }}
      >
        {label}
      </Button>
    );
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee", mb: 4 }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 70 }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <SwapHorizIcon
              sx={{ fontSize: 40, color: "primary.main", mr: 1, flexShrink: 0 }}
            />
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontWeight: 800,
                background: "linear-gradient(45deg, #6C63FF, #00C9A7)",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SlotSwapper
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <NavButton
              to="/dashboard"
              icon={<DashboardIcon />}
              label="My Schedule"
            />
            <NavButton
              to="/marketplace"
              icon={<StorefrontIcon />}
              label="Marketplace"
            />
            <NavButton
              to="/requests"
              icon={<SwapHorizIcon />}
              label="Requests"
              isRequestsButton={true}
            />
            <Box sx={{ width: 1, height: 30, bgcolor: "#eee", mx: 2 }} />
            <IconButton onClick={handleLogout} color="error" title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
