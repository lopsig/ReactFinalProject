import React from "react";
import { Grid, TextField, Button, Box } from "@mui/material";
import { useForm } from "react-hook-form";


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

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="City"
            placeholder="Ciudad"
            fullWidth
            {...register("city", { required: "Campo Requerido" })}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Street Name"
            placeholder="Nombre de calle"
            fullWidth
            {...register("streetName", { required: "Campo Requerido" })}
            error={!!errors.streetName}
            helperText={errors.streetName?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Street Number"
            placeholder="Número de calle"
            fullWidth
            type="number"
            {...register("streetNumber", { required: true })}
            error={!!errors.streetNumber}
            helperText={errors.streetNumber?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Area Size"
            placeholder="Tamaño del área"
            fullWidth
            type="number"
            {...register("areaSize", { required: true })}
            error={!!errors.areaSize}
            helperText={errors.areaSize?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Has AC"
            placeholder="¿Tiene aire acondicionado?"
            fullWidth
            {...register("hasAC", { required: true })}
            error={!!errors.hasAC}
            helperText={errors.hasAC?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Year Built"
            placeholder="Año construido"
            fullWidth
            type="number"
            {...register("yearBuilt", { required: true })}
            error={!!errors.yearBuilt}
            helperText={errors.yearBuilt?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Rent Price"
            placeholder="Precio de alquiler"
            fullWidth
            type="number"
            {...register("rentPrice", { required: true })}
            error={!!errors.rentPrice}
            helperText={errors.rentPrice?.message}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            type="date"
            label="Date Available"
            placeholder="Date Available"
            fullWidth
            {...register("dateAvailable", { required: true })}
            error={!!errors.dateAvailable}
            helperText={errors.dateAvailable?.message}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="'Image'"
            placeholder="'Image'"
            fullWidth
            {...register("src", { required: true })}
            error={!!errors.src}
            helperText={errors.src?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" fullWidth type="submit">
            {isEditing ? "Update Flat" : "Registrar Flat"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
