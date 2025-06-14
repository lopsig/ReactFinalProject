import React, { useEffect, useState } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";

import { FullFlatCardFavourite } from "../components/FullFlatCardFavourite";
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
    <Container sx={{ py: 10 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 4 }}
      >
        Tus Departamentos Favoritos
      </Typography>

      <Grid
        justifyContent="center"
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {favourites.length === 0 ? (
          <Typography>
            No tienes ningún flat marcado como favorito aún.
          </Typography>
        ) : (
          favourites.map((flat) => (
            <Grid size={{ xs: 2, sm: 4, md: 4 }} key={flat.id}>
              <Box
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <FullFlatCardFavourite {...flat} />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};
