import B31_3Calculator from "../components/b31_3/B31_3Calculator";
import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <B31_3Calculator />
    </Box>
  );
}
