"use client";

import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Represents dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Represents light mode
import { useThemeMode } from '@/app/ThemeContext';

export default function ThemeToggleButton() {
  const { toggleTheme, mode } = useThemeMode();

  return (
    <Tooltip title={mode === 'light' ? "Switch to dark mode" : "Switch to light mode"}>
      <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}