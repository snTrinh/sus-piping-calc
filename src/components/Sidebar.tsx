"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,

  Divider,

  useTheme,
} from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import FunctionsIcon from "@mui/icons-material/Functions";

import AssessmentIcon from "@mui/icons-material/Assessment";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import WaterDropIcon from "@mui/icons-material/WaterDrop";


const collapsedWidth = 56; 

export default function Sidebar() {

  const theme = useTheme();
  const router = useRouter();


  const navItems = [
    { icon: <CalculateIcon />, href: "/" },
    { icon: <AssessmentIcon />, href: "/z662" },
    { icon: <FunctionsIcon />, href: "/interpolation" },
    { icon: <WaterDropIcon />, href: "/hydro-test" },
    {  icon: <AlternateEmailIcon />, href: "/contact" },
  ];

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
        },
      }}
      open={true} 
    >

      <Divider /> 
      <List>
        {navItems.map(({  icon, href }) => (
          <ListItem key={href} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => router.push(href)}
              sx={{
                minHeight: 48, 
                justifyContent: "center", 
                px: 0, 
                borderRadius: 2,
                mx: 0.5, 
                my: 0.5,
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
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
                  padding: theme.spacing(1.5), 
                  color: "text.secondary",
                }}
              >
                {icon}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}