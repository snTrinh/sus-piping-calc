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
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions"; // interpolation icon
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AssessmentIcon from "@mui/icons-material/Assessment"; // new icon for Z662 Calculator
import Link from "next/link";
import { useState } from "react";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import WaterDropIcon from "@mui/icons-material/WaterDrop";

const drawerWidth = 240;
const collapsedWidth = 72;

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const navItems = [
    {
      label: "B31.3 Calculator",
      icon: <CalculateIcon />,
      href: "/",
    },
    {
      label: "Z662 Calculator",
      icon: <AssessmentIcon />,
      href: "/z662", // you can update this route if you have a specific one
    },
    {
      label: "Interpolation",
      icon: <FunctionsIcon />,
      href: "/interpolation",
    },
    {
      label: "Hydro Test Pressure",
      icon: <WaterDropIcon />,
      href: "/hydro-test",
    },
    {
      label: "Contact Us",
      icon: <ContactMailIcon />,
      href: "/contact",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
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
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
                {open && <ListItemText primary={label} />}
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
