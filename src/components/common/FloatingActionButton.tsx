"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Fab,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import { TransitionProps } from "@mui/material/transitions";

// Define a transition for the dialog to slide up
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
   
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FloatingActionButton() {
  // State for the contact form and dialog
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  const VERCEL_API_ENDPOINT =
    "https://email-sender-backend-indol.vercel.app/api/send-email";

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        setSnackbarMessage("Message sent successfully!");
        setSnackbarSeverity("success");
        setName("");
        setEmail("");
        setMessage("");
        setDialogOpen(false); // Close dialog on success
      } else {
        const errorData = await response.json();
        setSnackbarMessage(
          `Failed to send message: ${errorData.error || response.statusText}`
        );
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

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Optionally reset form fields when closing dialog without sending
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="contact"
        onClick={handleOpenDialog}
        sx={{
          position: "fixed", // Keeps the button fixed on screen
          bottom: 16, // Distance from bottom
          right: 16, // Distance from right
        }}
      >
        <EmailIcon />
      </Fab>

      {/* Contact Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition} // Apply slide transition
        aria-labelledby="contact-form-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2, // Apply border radius to the dialog paper
            minWidth: { xs: "90%", sm: "400px", md: "500px" }, // Responsive width
            maxWidth: "500px", // Max width for the dialog
          },
        }}
      >
        <DialogTitle id="contact-form-dialog-title" sx={{ m: 0, p: 2 }}>
          <Typography variant="h6" component="span" fontWeight="bold">
            Contact Us
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
             <TextField
                label="Your Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                size="small"
                required
               
                InputLabelProps={{
                  shrink: true, // This makes the label always appear on top
                }}
              />
              <TextField
                label="Your Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                required
                InputLabelProps={{
                  shrink: true, // This makes the label always appear on top
                }}
              />
              <TextField
                label="Something sus?"
                fullWidth
                multiline
                rows={4}
                placeholder="Send us a message to give us feedback."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                required
                InputLabelProps={{
                  shrink: true, // This makes the label always appear on top
                }}
              />
              <Button
                type="submit"
                variant="outlined"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : "Send Message"}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
