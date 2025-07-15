"use client";
import React, { useState } from "react";
import { Box, Button, Card, CardContent, TextField, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const VERCEL_API_ENDPOINT = "https://email-sender-backend-indol.vercel.app/api/send-email";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    setLoading(true);
    setSnackbarOpen(false); // Close any existing snackbar

    if (!name || !email || !message) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(VERCEL_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSnackbarMessage("Message sent successfully!");
        setSnackbarSeverity("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const errorData = await response.json();
        setSnackbarMessage(`Failed to send message: ${errorData.error || response.statusText}`);
        setSnackbarSeverity("error");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbarMessage("An unexpected error occurred. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" align="left" gutterBottom>
        Contact Us
      </Typography>
      {/* Two-column layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
        }}
      >
        <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 450 }, height: "auto" }}> {/* Adjusted height to auto */}
          <Card
            sx={{
              height: "100%",
              border: "1px solid #ddd",
            }}
            elevation={0}
          >
            <CardContent>
              <form onSubmit={handleSubmit}> {/* Wrap inputs in a form */}
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
                >
                  <TextField
                    label="Your Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    required
                  />
                  <TextField
                    label="Your Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    required
                  />
                  <TextField
                    label="Your Message"
                    fullWidth
                    multiline
                    rows={4} // Allows for multiple lines of input
                    placeholder="Something sus? Send us a message to give us feedback"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    size="small"
                    required
                  />
                  <Button
                    type="submit" // Set type to submit for form handling
                    variant="contained"
                    disabled={loading} // Disable button while loading
                    sx={{ mt: 2 }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Send Message"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Full-width row for PDF Export (if needed, currently commented out) */}
      <Box sx={{ width: "100%", mt: 4 }}>{/* <PdfExport /> */}</Box>
    </Box>
  );
}
