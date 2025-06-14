import { NavLink } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Avatar, IconButton, Menu, Tooltip, AppBar, } from "@mui/material";
import { auth, db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "../../auth/services/AuthServices";
import { MenuItem, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";












export const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async () => {
      const user = auth.currentUser;
      if (!user) return setIsAdmin(false);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      setIsAdmin(userData?.isAdmin === true);
    };

    checkIfAdmin();
  }, []);

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
          setActualUser(`${userData.firstName} ${userData.lastName}`);
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

  const handleLogout = async () => {
    await logoutUser(); // Llama a Firebase Auth para cerrar sesión
    // navigate("/auth/login"); // Redirige a login
  };


  return (
    <>
      <AppBar position="fixed">
        <CssBaseline />

        <Box
          sx={{
            bgcolor: "blue",
            color: "white",
            boxShadow: 3,
          }}

          // sx={{ border: 1, background: "blue" }}
        >
          <Toolbar
            disableGutters
            sx={{
              px: { xs: 2, sm: 3, md: 5 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component={NavLink}
              to="/home"
              sx={{
                mr: 2,
                textDecoration: "none",
                display: { xs: "none", md: "flex" },
                fontWeight: 700,
                color: "white",
                fontSize: { xs: "1rem", md: "1.25rem" },
                whiteSpace: "nowrap",
              }}
            >
              FLAT FINDER 🔍🏘️
            </Typography>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                mb: { md: 0 },
              }}
            >
              <Typography
                variant="h1"
                noWrap
                component={NavLink}
                to="/"
                sx={{
                  fontSize: "1rem",

                  color: "white",
                  textDecoration: "none",
                }}
              >
                FLAT FINDER 🔍🏘️
                <br />
                Hello - {actualUser}
              </Typography>
            </Box>

            {/* MENU PRICIPAL PARA DESKTOP */}

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                gap: 3,
                justifyContent: "center",
                mb: { md: 0 },
              }}
            >
              <Button
                onClick={() => navigate("/home")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>Home</strong>
              </Button>
              <Button
                onClick={() => navigate("/favourites")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>Favourites</strong>
              </Button>
              <Button
                onClick={() => navigate("/newflat")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>New Flat</strong>
              </Button>
            </Box>

            {/* MENU PRICIPAL PARA PP */}

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                gap: 2,
                justifyContent: "left",
              }}
            >
              <Button
                onClick={() => navigate("/")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>Home</strong>
              </Button>
              <Button
                onClick={() => navigate("/favourites")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>Favourites</strong>
              </Button>
              <Button
                onClick={() => navigate("/newflat")}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <strong>New Flat</strong>
              </Button>
            </Box>

            {/* MENU USUARIO SOLO EN MOVILES */}

            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "flex", md: "none" },
                ml: "auto",
                mr: 0,
              }}
            >
              <Tooltip title="User settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="src/assets/images/foto.jpg" />
                </IconButton>
              </Tooltip>
              {/* <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
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
                <MenuItem onClick={handleCloseUserMenu}>
                  <NavLink to="/profile" style={{ textDecoration: "none" }}>
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      My Profile
                    </Typography>
                  </NavLink>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <NavLink to="/myflats" style={{ textDecoration: "none" }}>
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      My Flats
                    </Typography>
                  </NavLink>
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <NavLink to="/users" style={{ textDecoration: "none" }}>
                      <Typography textAlign="center" sx={{ color: "black" }}>
                        All Users
                      </Typography>
                    </NavLink>
                  </MenuItem>
                )}
                <MenuItem onClick={handleCloseUserMenu}>
                  <NavLink
                    to="/auth/login"
                    onClick={handleLogout}
                    replace={true}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography textAlign="center" sx={{ color: "black" }}>
                      Log Out
                    </Typography>
                  </NavLink>
                </MenuItem>
              </Menu> */}

              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                onClick={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 180,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                    p: 1,
                  },
                }}
              >
                <MenuItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <NavLink
                    to="/profile"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                    <Typography sx={{ color: "black" }}>Mi Perfil</Typography>
                  </NavLink>
                </MenuItem>

                <MenuItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <NavLink
                    to="/myflats"
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <HomeIcon fontSize="small" />
                    <Typography sx={{ color: "black" }}>
                      Mis Departamentos
                    </Typography>
                  </NavLink>
                </MenuItem>

                {isAdmin && (
                  <MenuItem
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 1,
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <NavLink
                      to="/users"
                      style={{
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <GroupIcon fontSize="small" />
                      <Typography sx={{ color: "black" }}>
                        Todos los Usuarios
                      </Typography>
                    </NavLink>
                  </MenuItem>
                )}

                <MenuItem
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "#ffe6e6" },
                  }}
                >
                  <NavLink
                    to="/auth/login"
                    onClick={handleLogout}
                    replace
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    <Typography sx={{ color: "black" }}>
                      Cerrar Sesión
                    </Typography>
                  </NavLink>
                </MenuItem>
              </Menu>
            </Box>

            {/* MENU USUARIO SOLO PARA DESKTOP */}

            <Box
              sx={{
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
                gap: 2,
                alignItems: "center",
                pr: 2,
              }}
            >
              <Typography
                sx={{ color: "white", fontSize: "1rem", fontWeight: 700 }}
              >
                Hello - {actualUser}
              </Typography>

              <Tooltip title="User Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Avatar" src="src/assets/images/foto.jpg" />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>

      {/* Botón flotante para volver al top */}
      <Box
        sx={{
          position: "fixed",
          bottom: 12,
          left: 12,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          startIcon={<ArrowUpwardIcon />}
          sx={{
            borderRadius: "50px",
            // textTransform: "none",
            fontWeight: 600,
            boxShadow: 3,
          }}
        ></Button>
      </Box>
    </>
  );
};

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";