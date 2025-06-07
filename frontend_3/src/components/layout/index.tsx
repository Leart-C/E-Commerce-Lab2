import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Button, IconButton, Stack } from "@mui/material";
import { PATH_DASHBOARD, PATH_PUBLIC } from "../../routes/paths";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.hook";
import { AppSidebarList } from "./AppSidebar";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          {isAuthenticated ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", display: "inline" }}
              onClick={() => navigate("/")}
            >
              E-Commerce
            </Typography>
          </Box>

          <div>
            {isAuthenticated && user ? (
              <>
                <Button
                  variant="text"
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {user.userName}
                </Button>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      navigate(PATH_DASHBOARD.dashboard);
                      handleClose();
                    }}
                  >
                    Dashboard
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      logout();
                      handleClose();
                      handleDrawerClose();
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Stack direction="row" gap={4}>
                <Button
                  onClick={() => navigate(PATH_PUBLIC.register)}
                  type="button"
                  variant="text"
                  sx={{ color: "white" }}
                >
                  Register
                </Button>
                <Button
                  onClick={() => navigate(PATH_PUBLIC.login)}
                  type="button"
                  sx={{ color: "white" }}
                >
                  Login
                </Button>
              </Stack>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar start */}
      {isAuthenticated ? (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <AppSidebarList />
          <Divider />
        </Drawer>
      ) : null}
      {/* sidebar end */}

      <Main open={open}>
        <DrawerHeader />

        <Outlet />
      </Main>
    </Box>
  );
}
