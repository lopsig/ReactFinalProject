import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";

import { FullFlatCard } from "../components/FullFlatCard";
import { getFavouritesFromFirebase } from "../services/FavouriteRepository";

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
  userId: string;
}

export const FavouritePage = () => {
  const [favourites, setFavourites] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavourites = async () => {
      const data = await getFavouritesFromFirebase();
      setFavourites(data);
      setLoading(false);
    };
    loadFavourites();
  }, []);

  if (loading) {
    return <Container>Cargando tus favoritos...</Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {favourites.length === 0 ? (
          <Typography>
            No tienes ningún flat marcado como favorito aún.
          </Typography>
        ) : (
          favourites.map((flat) => (
            <Grid item xs={12} sm={6} md={4} key={flat.id}>
              <Box
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <FullFlatCard {...flat} />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};
