import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { FlatLayout } from "../helpers/FlatLayout";

import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerFlat } from "../services/FlatServices";



type RegisterFormData = {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  src: string;
};

export const NewFlatPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const navigate = useNavigate();



  const onSubmit = async (data: RegisterFormData) =>{


    try {
      const flat = await registerFlat(
        data.city,
        data.streetName,
        data.streetNumber,
        data.areaSize,
        data.hasAC,
        data.yearBuilt,
        data.rentPrice,
        data.dateAvailable,
        data.src
      );
      console.log("Flat registrado:", flat);
      navigate("/myflats");
    } catch (error) {
      console.error("Error al registrar flat: ", error);
    }
  };

  return (
    <FlatLayout description="">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label="City"
            placeholder="City"
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
            label="StreetName"
            placeholder="StreetName"
            fullWidth
            {...register("streetName", { required: "Campo Requerido" })}
            error={!!errors.streetName}
            helperText={errors.streetName?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Street Number"
            placeholder="Street Number"
            fullWidth
            {...register("streetNumber", { required: "Campo Requerido" })}
            error={!!errors.streetNumber}
            helperText={errors.streetNumber?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Area Size"
            placeholder="Area Size"
            fullWidth
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
            label="Year Built"
            placeholder="Year Built"
            fullWidth
            {...register("yearBuilt", { required: "Campo Requerido" })}
            error={!!errors.yearBuilt}
            helperText={errors.yearBuilt?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Rent Price"
            placeholder="Rent Price"
            fullWidth
            {...register("rentPrice", { required: "Campo Requerido" })}
            error={!!errors.rentPrice}
            helperText={errors.rentPrice?.message}
          />
        </Grid>
        <Grid sx={{ margin: 2 }}>
          Date Available
          <TextField
            type="date"
            label=""
            placeholder="Date Available"
            fullWidth
            {...register("dateAvailable", { required: "Campo Requerido" })}
            error={!!errors.dateAvailable}
            helperText={errors.dateAvailable?.message}
          />
        </Grid>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label='"Imagen"'
            placeholder='"Imagen"'
            fullWidth
            {...register("src", { required: "Campo Requerido" })}
            error={!!errors.src}
            helperText={errors.src?.message}
          />
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid size={{ sm: 6, xs: 12 }}>
            <Button variant="contained" fullWidth type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </FlatLayout>
  );
};




