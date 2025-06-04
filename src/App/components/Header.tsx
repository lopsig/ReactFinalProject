import { NavLink } from "react-router-dom";
import * as React from "react";
// import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, IconButton, Menu, Tooltip } from "@mui/material";

const actualUser = localStorage.getItem("actualUser") || "Invitado";
 

export const Header = () => {
  
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
      null
    );
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };

    const navLinkStyle = {
      color: "white",
      textDecoration: "none",
      padding: "12px",
      margin: "10px",
      fontWeight: "bold",
  };
  
  const navUserLinkStyle = {
    color: "black",
    textAlign: "center",
    padding: "5px",
  };

    return (
      <header>
        <Box sx={{ border: 1, background: "blue" }}>
          <CssBaseline />

          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <Box component="span" sx={navLinkStyle}>
                  <h1>
                    FLAT FINDER
                    <br />
                    🔍🏘️
                  </h1>
                </Box>
              </NavLink>
            </Typography>

            <Typography sx={{ flexGrow: 1 }}>
              <NavLink to="/" style={{ textDecoration: "none" }}>
                <Box component="span" sx={navLinkStyle}>
                  <h4>Hello - {actualUser} </h4>
                </Box>
              </NavLink>
            </Typography>

            <Box>
              <NavLink to="/">
                <Box component="span" sx={navLinkStyle}>
                  Home
                </Box>
              </NavLink>

              <NavLink to="/favourites">
                <Box component="span" sx={navLinkStyle}>
                  Favourites
                </Box>
              </NavLink>

              <NavLink to="/newflat">
                <Box component="span" sx={navLinkStyle}>
                  New Flat
                </Box>
              </NavLink>
              <NavLink to="/auth/login">
                <Box component="span" sx={navLinkStyle}>
                  Log Out
                </Box>
              </NavLink>

            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                onClick={handleCloseUserMenu}
              >

                  <NavLink to="/profile" style={{ textDecoration: "none" }}>
                    <Typography sx={navUserLinkStyle}>My Profile</Typography>
                  </NavLink>
                  <NavLink to="/myflats" style={{ textDecoration: "none" }}>
                    <Typography sx={navUserLinkStyle}>My Flats</Typography>
                  </NavLink>
                  <NavLink to="/users" style={{ textDecoration: "none" }}>
                    <Typography sx={navUserLinkStyle}>All Users</Typography>
                  </NavLink>
                  <NavLink to="/auth/login" style={{ textDecoration: "none" }}>
                    <Typography sx={navUserLinkStyle}>Log Out</Typography>
                  </NavLink>
                  <NavLink to="/profile" style={{ textDecoration: "none" }}>
                    <Typography sx={{ navUserLinkStyle, color: "red" }}>
                      Delete Account
                    </Typography>
                  </NavLink>
       
              </Menu>
            </Box>
          </Toolbar>
        </Box>

        {/* <div>
        <NavLink
          to="/login"
          onClick={onHandleLogOut}
          replace={true}
          className="text-red-500 font-semibold hover:underline text-sm"
        >
          Log out
        </NavLink>
      </div> */}
      </header>
    );
  }




