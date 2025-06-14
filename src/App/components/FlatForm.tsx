import React from "react";
import { Grid, TextField, Button, Box, Paper,Typography, FormControlLabel, Divider, Container, Switch } from "@mui/material";
import { useForm } from "react-hook-form";

import { FlatLayout } from "../helpers/FlatLayout";

type RegisterFormData = {
  city: string;
  streetName: string;
  streetNumber: string;
  areaSize: number;
  hasAC: string;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  src: string;
};


interface Props {
  initialData?: any;
  onSubmit: (data: any) => void;
  isEditing?: boolean;
}

export const FlatForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isEditing = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {},
  });

  const onFormSubmit = (data: RegisterFormData) => {
    onSubmit(data);
  };

  return (
    <Container
    // elevation={3}
    // sx={{
    //   maxWidth: 800,
    //   mx: "auto",
    //   p: 4,
    //   borderRadius: 3,
    //   mt: 4,
    // }}
    >
      <FlatLayout description="">
        <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Ciudad"
              placeholder="Ej: Quito"
              fullWidth
              error={!!errors.city}
              helperText={errors.city?.message}
              {...register("city", {
                required: "Campo Requerido",
              })}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Nombre de la calle"
              placeholder="Ej: Av. Amazonas"
              fullWidth
              {...register("streetName", {
                required: "El nombre de la calle es obligatorio",
              })}
              error={!!errors.streetName}
              helperText={errors.streetName?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Número de calle"
              placeholder="Ej: 123"
              fullWidth
              {...register("streetNumber", {
                required: "El número es obligatorio",
              })}
              error={!!errors.streetNumber}
              helperText={errors.streetNumber?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Area Size"
              placeholder="Area Size"
              fullWidth
              type="number"
              {...register("areaSize", { required: "Campo Requerido" })}
              error={!!errors.areaSize}
              helperText={errors.areaSize?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Has AC"
              placeholder="Has AC"
              fullWidth
              {...register("hasAC", { required: "Campo Requerido" })}
              error={!!errors.hasAC}
              helperText={errors.hasAC?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Año de construcción"
              placeholder="Ej: 2010"
              type="number"
              fullWidth
              {...register("yearBuilt", {
                required: "El año es obligatorio",
                min: { value: 1900, message: "Año no válido" },
              })}
              error={!!errors.yearBuilt}
              helperText={errors.yearBuilt?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Precio de alquiler ($)"
              placeholder="Ej: 500"
              type="number"
              fullWidth
              {...register("rentPrice", {
                required: "El precio es obligatorio",
              })}
              error={!!errors.rentPrice}
              helperText={errors.rentPrice?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Disponible desde"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dateAvailable", {
                required: "La fecha es obligatoria",
              })}
              error={!!errors.dateAvailable}
              helperText={errors.dateAvailable?.message}
            />
          </Grid>

          <Grid sx={{ margin: 2 }}>
            <TextField
              label="Imagen"
              placeholder="https://ejemplo.com/imagen.jpg"
              fullWidth
              {...register("src", {
                required: "Imagen es obligatoria",
              })}
              error={!!errors.src}
              helperText={errors.src?.message}
            />
          </Grid>

          <Grid
            container
            spacing={2}
            sx={{ mb: 2, mt: 1 }}
            justifyContent={"center"}
          >
            <Grid size={{ sm: 6, xs: 12 }}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  py: 1.3,
                  mt: 1,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                Actualizar
              </Button>
            </Grid>
          </Grid>
        </form>
      </FlatLayout>
    </Container>

    // <Box
    //   sx={{ py: 4 }}
    //   component="form"
    //   onSubmit={handleSubmit(onFormSubmit)}
    //   noValidate
    //   x={{ py: 10 }}>
    //   <Grid container spacing={2}>
    //     <Grid  xs={12}>
    //       <TextField
    //         label="City"
    //         placeholder="Ciudad"
    //         fullWidth
    //         {...register("city", { required: "Campo Requerido" })}
    //         error={!!errors.city}
    //         helperText={errors.city?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={12}>
    //       <TextField
    //         label="Street Name"
    //         placeholder="Nombre de calle"
    //         fullWidth
    //         {...register("streetName", { required: "Campo Requerido" })}
    //         error={!!errors.streetName}
    //         helperText={errors.streetName?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         label="Street Number"
    //         placeholder="Número de calle"
    //         fullWidth
    //         type="number"
    //         {...register("streetNumber", { required: true })}
    //         error={!!errors.streetNumber}
    //         helperText={errors.streetNumber?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         label="Area Size"
    //         placeholder="Tamaño del área"
    //         fullWidth
    //         type="number"
    //         {...register("areaSize", { required: true })}
    //         error={!!errors.areaSize}
    //         helperText={errors.areaSize?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         label="Has AC"
    //         placeholder="¿Tiene aire acondicionado?"
    //         fullWidth
    //         {...register("hasAC", { required: true })}
    //         error={!!errors.hasAC}
    //         helperText={errors.hasAC?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         label="Year Built"
    //         placeholder="Año construido"
    //         fullWidth
    //         type="number"
    //         {...register("yearBuilt", { required: true })}
    //         error={!!errors.yearBuilt}
    //         helperText={errors.yearBuilt?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         label="Rent Price"
    //         placeholder="Precio de alquiler"
    //         fullWidth
    //         type="number"
    //         {...register("rentPrice", { required: true })}
    //         error={!!errors.rentPrice}
    //         helperText={errors.rentPrice?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={6}>
    //       <TextField
    //         type="date"
    //         label="Date Available"
    //         placeholder="Date Available"
    //         fullWidth
    //         {...register("dateAvailable", { required: true })}
    //         error={!!errors.dateAvailable}
    //         helperText={errors.dateAvailable?.message}
    //       />
    //     </Grid>
    //     <Grid item xs={6}>
    //       <TextField
    //         label="'Image'"
    //         placeholder="'Image'"
    //         fullWidth
    //         {...register("src", { required: true })}
    //         error={!!errors.src}
    //         helperText={errors.src?.message}
    //       />
    //     </Grid>

    //     <Grid item xs={12}>
    //       <Button variant="contained" fullWidth type="submit">
    //         {isEditing ? "Update Flat" : "Registrar Flat"}
    //       </Button>
    //     </Grid>
    //   </Grid>
    // </Box>
  );
};
