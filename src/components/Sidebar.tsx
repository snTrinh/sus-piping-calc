"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import Link from "next/link";
import { useState } from "react";

const drawerWidth = 240;
const collapsedWidth = 72;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navItems = [
    { label: "B31.3 Calculator", icon: <CalculateIcon />, href: "/" },
    { label: "Z662 Calculator", icon: <AssessmentIcon />, href: "/z662" },
    { label: "Interpolation", icon: <FunctionsIcon />, href: "/interpolation" },
    { label: "Hydro Test Pressure", icon: <WaterDropIcon />, href: "/hydro-test" },
    { label: "Contact Us", icon: <ContactMailIcon />, href: "/contact" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          px: 1,
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map(({ label, icon, href }) => (
          <ListItem key={label} disablePadding sx={{ display: "block" }}>
            <Link href={href} passHref legacyBehavior>
              <ListItemButton
                component="a"
                sx={{
                  display: "flex",
                  justifyContent: open ? "initial" : "center",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={label} sx={{ opacity: 1 }} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
