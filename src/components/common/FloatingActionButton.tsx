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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
   
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FloatingActionButton() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [dialogOpen, setDialogOpen] = useState(false); 

  const VERCEL_API_ENDPOINT =
    "https://email-sender-backend-indol.vercel.app/api/send-email";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setLoading(true);
    setSnackbarOpen(false); 

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
        setDialogOpen(false); 
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

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>

      <Fab
        color="primary"
        aria-label="contact"
        onClick={handleOpenDialog}
        sx={{
          position: "fixed", 
          bottom: 16, 
          right: 16, 
        }}
      >
        <EmailIcon />
      </Fab>


      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        TransitionComponent={Transition} 
        aria-labelledby="contact-form-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: "90%", sm: "400px", md: "500px" }, 
            maxWidth: "500px", 
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
                  shrink: true, 
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
                  shrink: true, 
                }}
              />
              <TextField
                label="Something sus?"
                fullWidth
                multiline
                rows={4}
 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                required
                InputLabelProps={{
                  shrink: true,
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
