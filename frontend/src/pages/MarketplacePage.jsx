import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Alert,
  Chip,
} from "@mui/material";
import api from "../services/api";

export default function MarketplacePage() {
  const [marketSlots, setMarketSlots] = useState([]);
  const [myOfferableSlots, setMyOfferableSlots] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // 1. Load Marketplace on page load
  useEffect(() => {
    fetchMarketSlots();
  }, []);

  const fetchMarketSlots = async () => {
    try {
      const response = await api.get("/api/swappable-slots");
      setMarketSlots(response.data);
    } catch (error) {
      console.error("Error loading marketplace", error);
    }
  };

  // 2. Open the modal and Find what I can offer
  const handleOpenSwapModal = async (targetSlot) => {
    setSelectedTarget(targetSlot);
    try {
      // Reuse the generic events endpoint and filter frontend-side for simplicity
      const response = await api.get("/api/events");
      const mySwappables = response.data.filter(
        (e) => e.status === "SWAPPABLE"
      );
      setMyOfferableSlots(mySwappables);
      setOpen(true);
    } catch (error) {
      showNotification("Could not load your slots", "error");
    }
  };

  // 3. Send the final request to the backend
  const handleSendRequest = async (mySlotId) => {
    try {
      // 1. Send the request to the backend
      await api.post("/api/swap-request", {
        mySlotId: mySlotId,
        theirSlotId: selectedTarget.id,
      });

      showNotification("Swap request sent!", "success");
      setOpen(false);

      setMarketSlots((currentSlots) =>
        currentSlots.filter((slot) => slot.id !== selectedTarget.id)
      );
      // ----------------
    } catch (error) {
      console.log(error);
      showNotification("Request failed. Someone might have taken it!", "error");
      // If it failed, it's good practice to refresh the list to see the *real* current state
      fetchMarketSlots();
    }
  };

  // Helper for showing alerts
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available for Swap
      </Typography>

      {notification.show && (
        <Alert severity={notification.type} sx={{ mb: 3 }}>
          {notification.message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {marketSlots.map((slot) => (
          <Grid item xs={12} md={6} key={slot.id}>
            <Paper
              sx={{ p: 2, bgcolor: "#f8f9fa", border: "1px solid #e9ecef" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">{slot.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Owner ID: {slot.userId}
                  </Typography>
                </Box>
                <Chip label="AVAILABLE" color="success" size="small" />
              </Box>

              <Typography variant="body2" sx={{ mb: 2 }}>
                📅 {new Date(slot.startTime).toLocaleString()}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleOpenSwapModal(slot)}
              >
                Request Swap
              </Button>
            </Paper>
          </Grid>
        ))}

        {marketSlots.length === 0 && (
          <Box sx={{ mt: 5, width: "100%", textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              The marketplace is empty.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Wait for other users to mark their slots as 'SWAPPABLE'.
            </Typography>
          </Box>
        )}
      </Grid>

      {/* --- MODAL TO SELECT MY OFFER --- */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>What will you offer in return?</DialogTitle>
        <List sx={{ pt: 0 }}>
          {myOfferableSlots.map((mySlot) => (
            <ListItem key={mySlot.id} disableGutters>
              <Box
                sx={{
                  p: 2,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{mySlot.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(mySlot.startTime).toLocaleString()}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={() => handleSendRequest(mySlot.id)}
                >
                  Offer This
                </Button>
              </Box>
            </ListItem>
          ))}
          {myOfferableSlots.length === 0 && (
            <Alert severity="warning" sx={{ m: 2 }}>
              You have no <strong>SWAPPABLE</strong> slots to offer. Go to your
              Dashboard and mark one as Swappable first!
            </Alert>
          )}
        </List>
      </Dialog>
    </Container>
  );
}
