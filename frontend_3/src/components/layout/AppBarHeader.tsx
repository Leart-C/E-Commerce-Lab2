import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import useAuth from "../../hooks/useAuth.hook";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, Stack } from "@mui/material";
import { PATH_DASHBOARD, PATH_PUBLIC } from "../../routes/paths";
import { MdAccountCircle } from "react-icons/md";

export default function AppBarHeader() {
  const { isAuthLoading, isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const userRolesLabelCreator = () => {
    if (user) {
      let result = "";
      user.roles.forEach((role, index) => {
        result += role;
        if (index < user.roles.length - 1) {
          result += ", ";
        }
      });
      return result;
    }
    return "--";
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="f">
        <Toolbar>
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{ cursor: "pointer", display: "inline" }}
              onClick={() => navigate("/")}
            >
              E-Commerce
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
