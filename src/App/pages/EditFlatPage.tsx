import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { FlatForm } from "../components/FlatForm";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const EditFlatPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any | null>(null);

  useEffect(() => {
    const loadFlat = async () => {
      if (!id) return;

      try {
        const flatDoc = await getDoc(doc(db, "flats", id));
        if (flatDoc.exists()) {
          setInitialData({ id: flatDoc.id, ...flatDoc.data() });
        } else {
          alert("No se encontró el flat");
          navigate("/myflats");
        }
      } catch (error) {
        console.error("Error al cargar el flat:", error);
        alert("Hubo un error al cargar los datos");
        navigate("/myflats");
      }
    };

    loadFlat();
  }, [id, navigate]);

  const handleUpdate = async (updatedFlat) => {
    try {
      const flatRef = doc(db, "flats", updatedFlat.id);
      await updateDoc(flatRef, {
        city: updatedFlat.city,
        streetName: updatedFlat.streetName,
        streetNumber: updatedFlat.streetNumber,
        areaSize: updatedFlat.areaSize,
        hasAC: updatedFlat.hasAC,
        yearBuilt: updatedFlat.yearBuilt,
        rentPrice: updatedFlat.rentPrice,
        dateAvailable: updatedFlat.dateAvailable,
        userId: updatedFlat.userId, // No cambiamos el userId, es del usuario logueado
      });

      alert("Flat actualizado correctamente");
      navigate("/myflats");
    } catch (error) {
      console.error("Error al actualizar el flat:", error);
      alert("Hubo un error al guardar los cambios");
    }
  };

  if (!initialData) {
    return <Container>Cargando datos...</Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Editar Flat
      </Typography>

      <FlatForm initialData={initialData} onSubmit={handleUpdate} isEditing />
    </Container>
  );
};
