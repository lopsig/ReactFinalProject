// import { useParams } from "react-router-dom";
// import { getFlatList } from "../helpers/Flats";
// import {FullFlatCard } from "../components/FlatCard";
// import { Box, Container, Typography } from "@mui/material";


// export const FlatDetailPage: React.FC = () => {
//   const { src } = useParams<{ src: string }>();
//   const flats = getFlatList();
//   const flat = flats.find((p) => p.src === src);

//   if (!flat) {
//     return <Typography>Producto no encontrado</Typography>;
//   }

//   return (
//     <Container sx={{ py: 4 }}>
//       <Box display="flex" justifyContent="center">
//         <FullFlatCard {...flat} />

//       </Box>
//     </Container>
//   );
// };

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";
import { FullFlatCard } from "../components/FlatCard";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

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

export const FlatDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flat, setFlat] = useState<ProductCardProps | null>(null);

  useEffect(() => {
    const fetchFlat = async () => {
      if (!id) return setFlat(null);

      try {
        const flatDoc = await getDoc(doc(db, "flats", id));

        if (flatDoc.exists()) {
          const data = flatDoc.data();
          setFlat({ id: flatDoc.id, ...data } as ProductCardProps);
        } else {
          setFlat(null); // No existe el documento
        }
      } catch (error) {
        console.error("Error al traer el flat:", error);
        setFlat(null);
      }
    };

    fetchFlat();
  }, [id]);

  if (!flat) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>Producto no encontrado</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="center">
        <FullFlatCard {...flat} />
      </Box>
    </Container>
  );
};