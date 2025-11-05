import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Alert,
} from "@mui/material";
import api from "../services/api";

export default function RequestsPage() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const inRes = await api.get("/api/swap-requests/incoming");
      const outRes = await api.get("/api/swap-requests/outgoing");
      setIncoming(inRes.data);
      setOutgoing(outRes.data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  const handleResponse = async (requestId, isAccepted) => {
    try {
      await api.post(`/api/swap-response/${requestId}`, {
        accepted: isAccepted,
      });
      setStatusMsg(
        isAccepted ? "Swap Accepted! Calendar updated." : "Swap Rejected."
      );
      fetchRequests();
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (error) {
      alert("Action failed. The request might have expired.");
    }
  };

  const RequestCard = ({ req, isIncoming }) => (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderLeft: isIncoming ? "6px solid #1976d2" : "6px solid #9c27b0",
        bgcolor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Wants: {req.desiredSlotTitle}
        </Typography>
        <Chip
          label={req.status}
          size="small"
          color={
            req.status === "PENDING"
              ? "warning"
              : req.status === "ACCEPTED"
              ? "success"
              : "error"
          }
          sx={{ fontWeight: "bold" }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{ color: "text.secondary", lineHeight: 1.6 }}
      >
        <strong>Offers:</strong> {req.offeredSlotTitle} <br />
        📅 {new Date(req.offeredSlotStartTime).toLocaleString()} <br />
        👤{" "}
        {isIncoming
          ? `From: ${req.requesterName}`
          : `To owner of: ${req.desiredSlotTitle}`}
      </Typography>

      {isIncoming && req.status === "PENDING" && (
        <Box
          sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}
        >
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleResponse(req.id, false)}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleResponse(req.id, true)}
          >
            Accept Swap
          </Button>
        </Box>
      )}
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {statusMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {statusMsg}
        </Alert>
      )}
      <Grid container spacing={4}>
        {/* INCOMING COLUMN */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 3, bgcolor: "#f8faff", minHeight: "400px" }}
            elevation={0}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#1976d2",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📥 Incoming Requests
            </Typography>
            <Divider sx={{ mb: 3, opacity: 0.6 }} />

            {incoming.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 8, opacity: 0.6 }}>
                <Typography variant="h6">All caught up!</Typography>
                <Typography variant="body2">
                  No one has requested your slots yet.
                </Typography>
              </Box>
            ) : (
              incoming.map((req) => (
                <RequestCard key={req.id} req={req} isIncoming={true} />
              ))
            )}
          </Paper>
        </Grid>

        {/* OUTGOING COLUMN */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 3, bgcolor: "#faf5ff", minHeight: "400px" }}
            elevation={0}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "#9c27b0",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📤 Outgoing Requests
            </Typography>
            <Divider sx={{ mb: 3, opacity: 0.6 }} />

            {outgoing.length === 0 ? (
              <Box sx={{ textAlign: "center", mt: 8, opacity: 0.6 }}>
                <Typography variant="h6">No active requests</Typography>
                <Typography variant="body2">
                  Go to the Marketplace to make an offer.
                </Typography>
              </Box>
            ) : (
              outgoing.map((req) => (
                <RequestCard key={req.id} req={req} isIncoming={false} />
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
