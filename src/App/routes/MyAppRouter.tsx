import { HomePage } from "../pages/HomePage";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "../components/Header";
// import { SideBar } from "../components/SideBar";
import { Box } from "@mui/material";
import { FavouritePage } from "../pages/FavouritePage";
import { MyFlatsPage } from "../pages/MyFlatsPage";
import { NewFlatPage } from "../pages/NewFlatPage";


export const MyAppRouter = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* <Box
          component="nav"
          sx={{
            width: 150,
            backgroundColor: "#1976d2",
            color: "white",
            p: 2,
          }}
        >
          <SideBar />
        </Box> */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#f5f5f5",
            minHeight: "100%",
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favourites" element={<FavouritePage />} />
            <Route path="/myflats" element={<MyFlatsPage />} />
            <Route path="/newflat" element={<NewFlatPage />} />
            <Route path="/*" element={<Navigate to={"/"} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};
