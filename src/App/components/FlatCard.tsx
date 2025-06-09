

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
  Box,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { isFavouriteInFirebase } from "../services/FavouriteRepository";
import { addFavourite, removeFavourite } from "../services/FavouriteRepository";
import { auth } from "../../firebase/firebase";







interface ProductCardProps {
  id: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean | string;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  src: string;
  userId: string;
}

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

export const FlatCard: React.FC<ProductCardProps> = ({
  id,
  city,
  rentPrice,
  dateAvailable,
  areaSize,
  src,
  alt,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);

  const navigate = useNavigate();

  // Verifica si ya es favorito al cargar el componente
  useEffect(() => {
    const checkIfFavourite = async () => {
      const status = await isFavouriteInFirebase(id);
      setIsFavourite(status);
    };

    checkIfFavourite();
  }, [id]);

  const handleFavouriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita doble navegación

    if (isFavourite) {
      await removeFavourite(id);
      setIsFavourite(false);
    } else {
      await addFavourite({
        id,
        city,
        rentPrice,
        dateAvailable,
        areaSize,
        userId: auth.currentUser?.uid || "",
      });
      setIsFavourite(true);
    }
  };

  return (
    <StyledCard
      onClick={() =>
        navigate(`/item/${encodeURIComponent(id)}`, {
          state: { id, city, rentPrice, dateAvailable, areaSize },
        })
      }
    >
      {/* Icono de favorito */}
      <Box
        onClick={handleFavouriteClick}
        sx={{
          position: "relative",
          left: "90%",
          zIndex: -10,
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
          height: "200px",
          objectFit: "cover",
        }}
      />

      {/* Contenido básico */}
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {city}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${rentPrice}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Area Size: {areaSize} m²
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {dateAvailable}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

