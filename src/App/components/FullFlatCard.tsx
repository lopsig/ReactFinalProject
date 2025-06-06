import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
  Box,
} from "@mui/material";

import { type ProductCardProps } from "../interfaces/ProductCardPropos";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { addFavourite, isFavouriteInFirebase, removeFavourite } from "../services/FavouriteRepository";
import { auth } from "../../firebase/firebase";


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

////////////////////////////////////////
export const FullFlatCard: React.FC<ProductCardProps> = ({
  id,
  city,
  streetName,
  streetNumber,
  areaSize,
  hasAC,
  yearBuilt,
  rentPrice,
  dateAvailable,
  src,
  alt,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await isFavouriteInFirebase(id);
      setIsFavourite(status);
    };
    checkStatus();
  }, [id]);

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Para evitar que haga click en el card y navegue

    if (isFavourite) {
      await removeFavourite(id);
      setIsFavourite(false);
    } else {
      await addFavourite({
        id,
        city,
        streetName,
        streetNumber,
        areaSize,
        hasAC,
        yearBuilt,
        rentPrice,
        dateAvailable,
        userId: auth.currentUser?.uid || "",
      });
      setIsFavourite(true);
    }
  };

  return (
    <StyledCard>
      {/* Icono de favorito */}
      <Box
        onClick={handleFavouriteClick}
        sx={{
          position: "relative",
          left: 200,
          zIndex: 10,
          cursor: "pointer",
          color: isFavourite ? "red" : "rgba(255, 0, 0, 0.4)",
          // transition: "color 0.3s ease",
        }}
      >
        <FavoriteIcon />
      </Box>

      {/* Imagen */}
      <CardMedia
        component="img"
        image={src}
        alt={alt}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />

      {/* Detalles completos */}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {city}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${rentPrice}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {dateAvailable}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Name: {streetName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Number: {streetNumber}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Area Size: {areaSize} m²
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Has AC: {hasAC ? "Sí" : "No"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Year Built: {yearBuilt}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

