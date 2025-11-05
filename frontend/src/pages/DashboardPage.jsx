import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Fade,
} from "@mui/material";
// Optional icons for a pro look
import EventIcon from "@mui/icons-material/Event";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // --- 1. FETCH DATA ---
  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events");
      // Sort events by start time (newest first)
      const sortedEvents = response.data.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
      if (error.response && error.response.status === 403) {
        // Token expired or invalid
        localStorage.removeItem("jwt_token");
        navigate("/login");
      }
    }
  };

  // Load data on page load
  useEffect(() => {
    fetchEvents();
  }, []);

  // --- 2. HANDLERS ---
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMsg("");
    setNewEvent({ title: "", startTime: "", endTime: "" });
  };

  const handleCreateEvent = async () => {
    // Basic validation
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (new Date(newEvent.startTime) >= new Date(newEvent.endTime)) {
      setErrorMsg("End time must be after start time.");
      return;
    }

    try {
      await api.post("/api/events", newEvent);
      handleClose();
      fetchEvents(); // Refresh list immediately
    } catch (error) {
      setErrorMsg("Failed to create event. Please try again.");
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      // Optimistic update: Update UI immediately for snappy feel
      setEvents((currentEvents) =>
        currentEvents.map((ev) =>
          ev.id === eventId ? { ...ev, status: newStatus } : ev
        )
      );
      // Send actual request to backend
      await api.put(`/api/events/${eventId}/status`, { status: newStatus });
      // (Optional: fetchEvents() here if you want to be 100% sure of server state)
    } catch (error) {
      alert("Failed to update status. It might be locked in a pending swap.");
      fetchEvents(); // Revert UI on failure
    }
  };

  // --- 3. RENDER ---
  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        {/* HEADER SECTION */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              My Schedule
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your availability and offer slots for swapping.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleOpen}
            sx={{ px: 3 }}
          >
            Add Event
          </Button>
        </Box>

        {/* EVENT LIST SECTION */}
        <Grid container spacing={2}>
          {events.map((event) => (
            <Grid item xs={12} key={event.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "primary.light",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                  },
                }}
              >
                {/* LEFT: Event Details */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    gap: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <EventIcon color="action" sx={{ mt: 0.5 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, lineHeight: 1.2 }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {new Date(event.startTime).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {" • "}
                      {new Date(event.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(event.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>

                {/* RIGHT: Status Controls */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexShrink: 0,
                  }}
                >
                  <Chip
                    label={event.status.replace("_", " ")}
                    size="small"
                    color={
                      event.status === "BUSY"
                        ? "default"
                        : event.status === "SWAPPABLE"
                        ? "success"
                        : "warning"
                    }
                    sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                  />

                  {event.status !== "SWAP_PENDING" ? (
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel id={`status-${event.id}`}>
                        Availability
                      </InputLabel>
                      <Select
                        labelId={`status-${event.id}`}
                        value={event.status}
                        label="Availability"
                        onChange={(e) =>
                          handleStatusChange(event.id, e.target.value)
                        }
                      >
                        <MenuItem value="BUSY">Busy (Private)</MenuItem>
                        <MenuItem value="SWAPPABLE">Offer to Swap</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",
                        color: "warning.main",
                        fontWeight: 600,
                      }}
                    >
                      🔒 Locked for Swap
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}

          {events.length === 0 && (
            <Box
              sx={{ mt: 8, width: "100%", textAlign: "center", opacity: 0.6 }}
            >
              <EventIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Your schedule is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Add Event" to get started.
              </Typography>
            </Box>
          )}
        </Grid>

        {/* ADD EVENT DIALOG */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle sx={{ pb: 1 }}>Add New Event</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the details for your new busy slot.
            </Typography>

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMsg}
              </Alert>
            )}

            <TextField
              autoFocus
              margin="dense"
              label="Event Title"
              placeholder="e.g., Team Meeting, Focus Time"
              fullWidth
              variant="outlined"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Time"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newEvent.startTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, startTime: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Time"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newEvent.endTime}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, endTime: e.target.value })
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              variant="contained"
              sx={{ px: 4 }}
            >
              Create Event
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Fade>
  );
}
