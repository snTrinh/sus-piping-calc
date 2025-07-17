"use client";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  useTheme,
  Tooltip,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useThemeMode } from '../app/ThemeContext';


const collapsedWidth = 56;
const iconButtonSize = 40; // Consistent size for the circular hover area

export default function Sidebar() {
  const theme = useTheme();
  const router = useRouter();
  const { toggleTheme, mode } = useThemeMode();

  const navItems = [
    { icon: <CalculateIcon />, href: "/", label: "Calculations" },
    { icon: <AssessmentIcon />, href: "/z662", label: "Z662 Code" },
    { icon: <FunctionsIcon />, href: "/interpolation", label: "Utilities" },
  ];

  const themeToggleItem = {
    icon: mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />,
    label: mode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode",
    onClick: toggleTheme,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsedWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: collapsedWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
      open={true}
    >
      <Divider />
      <List>
        {navItems.map(({ icon, href, label }) => (
          <ListItem key={href} disablePadding sx={{ display: "block" }}>
            <Tooltip title={label} placement="right">
              <ListItemButton
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior if any
                  console.log(`Attempting to navigate to: ${href}`); // Debugging log
                  router.push(href);
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 0,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "transparent", // Hide ListItemButton's hover background
                  },
                  cursor: "pointer",
                  color: "inherit",
                  textDecoration: "none",
                  fontFamily: "Roboto, Arial, sans-serif",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    width: iconButtonSize,
                    height: iconButtonSize,
                    borderRadius: '50%',
                    margin: theme.spacing(0.5),
                    transition: "background-color 0.2s",
                    color: "text.secondary",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover, // Circular hover effect remains here
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem key="theme-toggle" disablePadding sx={{ display: "block" }}>
          <Tooltip title={themeToggleItem.label} placement="right">
            <ListItemButton
              onClick={themeToggleItem.onClick}
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 0,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "transparent", // Hide ListItemButton's hover background
                },
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
                fontFamily: "Roboto, Arial, sans-serif",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  width: iconButtonSize,
                  height: iconButtonSize,
                  borderRadius: '50%',
                  margin: theme.spacing(0.5),
                  transition: "background-color 0.2s",
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {themeToggleItem.icon}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}
