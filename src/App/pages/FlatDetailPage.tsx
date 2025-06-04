import { useParams } from "react-router-dom";
import { getFlatList } from "../helpers/Flats";
import {FullFlatCard } from "../components/FlatCard";
import { Box, Container, Typography } from "@mui/material";


export const FlatDetailPage: React.FC = () => {
  const { src } = useParams<{ src: string }>();
  const flats = getFlatList();
  const flat = flats.find((p) => p.src === src);

  if (!flat) {
    return <Typography>Producto no encontrado</Typography>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center">
        <FullFlatCard {...flat} />

      </Box>
    </Container>
  );
};
