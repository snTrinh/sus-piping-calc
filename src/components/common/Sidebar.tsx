"use client";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions";
import WaterIcon from "@mui/icons-material/Water";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useThemeMode } from "../../app/ThemeContext";

const collapsedWidth = 56;
const iconButtonSize = 40;

export default function Sidebar() {
  const theme = useTheme();
  const router = useRouter();
  const { toggleTheme, mode } = useThemeMode();

  const navItems = [
    { icon: <CalculateIcon />, href: "/", label: "Calculations" },
    { icon: <WaterIcon />, href: "/hydro-test", label: "Hydro Test" },
    // import AssessmentIcon from "@mui/icons-material/Assessment";
    { icon: <FunctionsIcon />, href: "/interpolation", label: "Utilities" },
  ];

  const themeToggleItem = {
    icon: mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />,
    label: mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
    onClick: toggleTheme,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsedWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // top nav / bottom FAB
          alignItems: "center",
          py: 1,
        },
      }}
      open={true}
    >
  
      <Box>
        <List>
          {navItems.map(({ icon, href, label }) => (
            <ListItem key={href} disablePadding sx={{ display: "block" }}>
              <Tooltip title={label} placement="right">
                <ListItemButton
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(href);
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: "center",
                    px: 0,
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "pointer",
                    color: "inherit",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      display: "flex",
                      width: iconButtonSize,
                      height: iconButtonSize,
                      borderRadius: "50%",
                      m: 0.5,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                      color: "text.secondary",
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
                  "&:hover": { backgroundColor: "transparent" },
                  cursor: "pointer",
                  color: "inherit",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    display: "flex",
                    width: iconButtonSize,
                    height: iconButtonSize,
                    borderRadius: "50%",
                    m: 0.5,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                    color: "text.secondary",
                  }}
                >
                  {themeToggleItem.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
