import { NavLink } from "react-router-dom";
import * as React from "react";
// import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, Button, IconButton, Menu, Tooltip } from "@mui/material";
import { auth, db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "../../auth/services/AuthServices";
 


 

export const Header = () => {
  const [actualUser, setActualUser] = useState<string>("Invitado");
 
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
      null
  );
    useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setActualUser(`${userData.firstName}`);
        }
      }
    };

    loadUser();
  }, []);
  

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };
  
  // const handleLogout = async () => {
  //   await logoutUser(); // Llama a Firebase Auth para cerrar sesión
  //   navigate("/auth/login"); // Redirige a login
  // };

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



              {/* <NavLink
                to="/login"
                onClick={handleLogout}
                replace={true}
                className="text-red-500 font-semibold hover:underline text-sm"
              >
                Log out
              </NavLink> */}
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
      </header>
    );
  }




