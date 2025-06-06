import React, { useEffect, useState } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";

import { FullFlatCardDelete } from "../components/FullFlatCardDelete";
import { deleteFlat } from "../services/FlatServices";


import { getFlatsByUserId } from "../services/FlatServices";
import { useNavigate } from "react-router-dom";


interface Flat {
  id?: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  userId: string;
}

export const MyFlatsPage = () => {
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const loadFlats = async () => {
    const data = await getFlatsByUserId();
    setFlats(data as Flat[]);
  };

  const handleDelete = async (flatId: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este flat?")) return;

    try {
      await deleteFlat(flatId);

      // Actualizar estado local sin recargar página
      setFlats(flats.filter((flat) => flat.id !== flatId));
    } catch (error) {
      alert("Hubo un error al eliminar el flat");
    }
  };



  useEffect(() => {
    const loadFlats = async () => {
      const userFlats = await getFlatsByUserId();
      setFlats(userFlats);
      setLoading(false);
    };

    loadFlats();
  }, []);

  if (loading) {
    return <Container>Cargando tus flats...</Container>;
  }

  // Función opcional: navegar al detalle
  const handleFlatClick = (flat: Flat) => {
    navigate(`/item/${encodeURIComponent(flat.id || "")}`, { state: flat });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {flats.length === 0 ? (
          <Typography>No tienes ningún flat registrado.</Typography>
        ) : (
          flats.map((flat) => (
            <Grid item xs={12} sm={6} md={4} key={flat.id}>
              <Box
                onClick={() => handleFlatClick(flat)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              >
                <FullFlatCardDelete
                  id={flat.id}
                  city={flat.city}
                  streetName={flat.streetName}
                  streetNumber={flat.streetNumber}
                  areaSize={flat.areaSize}
                  hasAC={flat.hasAC}
                  yearBuilt={flat.yearBuilt}
                  rentPrice={flat.rentPrice}
                  dateAvailable={flat.dateAvailable}
                  userId={flat.userId}
                  onDelete={() => handleDelete(flat.id)}
                />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};