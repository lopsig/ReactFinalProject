import React from "react";
import { getFlatList } from "../helpers/Flats";
import { useNavigate } from "react-router-dom";
import { FlatCard } from "../components/FlatCard";
import { Box, Container } from "@mui/material";
import { Grid } from "@mui/material";

export const HomePage: React.FC = () => {
  const flats = getFlatList();
  const navigate = useNavigate();

  const onNavigate = (p: any) => {
    navigate(`/item/${encodeURIComponent( p.src)}`, { state: p });
  };

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        {flats.map((p, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box
              onClick={() => onNavigate(p)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <FlatCard {...p} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
