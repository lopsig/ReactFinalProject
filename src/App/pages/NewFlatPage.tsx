import React, { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";
import { FlatLayout } from "../helpers/FlatLayout";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerFlat } from "../services/FlatServices";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";




type RegisterFormData = {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  image: FileList;
};

export const NewFlatPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
          <TextField
            label="Date Available"
            placeholder="Date Available"
            fullWidth
            {...register("dateAvailable", { required: "Campo Requerido" })}
            error={!!errors.dateAvailable}
            helperText={errors.dateAvailable?.message}
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




////////////////////////////////////
///////////////////////////////////
/////////////////////////////////////

// import React, { useState } from "react";
// import { Grid, TextField, Button, Typography } from "@mui/material";
// import { FlatLayout } from "../helpers/FlatLayout";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { registerFlat } from "../services/FlatServices";
// import {
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
// } from "firebase/storage";
// import { auth } from "../../firebase/firebase";

// import { storage } from "../../firebase/firebase";








// type RegisterFormData = {
//   city: string;
//   streetName: string;
//   streetNumber: number;
//   areaSize: number;
//   hasAC: boolean;
//   yearBuilt: number;
//   rentPrice: number;
//   dateAvailable: string;
//   image: FileList;
// };

// export const NewFlatPage = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     // setValue,
//   } = useForm<RegisterFormData>();

//   const [image, setImage] = useState<File | null>(null);
//   const navigate = useNavigate();

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

  

//   const onSubmit = async (data: RegisterFormData) => {
//     if (!image) {
//       alert("Por favor selecciona una imagen");
//       return;
//     }

//     try {
//       const imageRef = ref(storage, `flats/${image.name}`);
//       const uploadTask = uploadBytesResumable(imageRef, image);

//       await new Promise<void>((resolve, reject) => {
//         uploadTask.on(
//           "state_changed",
//           null,
//           (error) => {
//             console.error("Error al subir imagen:", error);
//             reject(error);
//           },
//           () => {
//             resolve();
//           }
//         );
//       });

//       const downloadURL = await getDownloadURL(imageRef);

//       // Llama a tu función de registrar flat con la URL
//       await registerFlat({
//         city: data.city,
//         streetName: data.streetName,
//         streetNumber: data.streetNumber,
//         areaSize: data.areaSize,
//         hasAC: data.hasAC,
//         yearBuilt: data.yearBuilt,
//         rentPrice: data.rentPrice,
//         dateAvailable: data.dateAvailable,
//         src: downloadURL, 
//         alt: `${data.city} - ${data.streetName}`,
//         userId: auth.currentUser?.uid || "",
//       });

//       alert("Imagen subida y flat registrado correctamente");
//     } catch (error) {
//       console.error("Error al subir imagen:", error);
//       alert("Hubo un problema al subir la imagen");
//     }
//   };

   
   
 

//   return (
//     <FlatLayout description="Registrar Nuevo Flat">
//       <form onSubmit={handleSubmit(onSubmit)} noValidate>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="City"
//             placeholder="City"
//             fullWidth
//             error={!!errors.city}
//             helperText={errors.city?.message}
//             {...register("city", {
//               required: "Campo Requerido",
//             })}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="StreetName"
//             placeholder="StreetName"
//             fullWidth
//             {...register("streetName", { required: "Campo Requerido" })}
//             error={!!errors.streetName}
//             helperText={errors.streetName?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Street Number"
//             placeholder="Street Number"
//             fullWidth
//             {...register("streetNumber", { required: "Campo Requerido" })}
//             error={!!errors.streetNumber}
//             helperText={errors.streetNumber?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Area Size"
//             placeholder="Area Size"
//             fullWidth
//             {...register("areaSize", { required: "Campo Requerido" })}
//             error={!!errors.areaSize}
//             helperText={errors.areaSize?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Has AC"
//             placeholder="Has AC"
//             fullWidth
//             {...register("hasAC", { required: "Campo Requerido" })}
//             error={!!errors.hasAC}
//             helperText={errors.hasAC?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Year Built"
//             placeholder="Year Built"
//             fullWidth
//             {...register("yearBuilt", { required: "Campo Requerido" })}
//             error={!!errors.yearBuilt}
//             helperText={errors.yearBuilt?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Rent Price"
//             placeholder="Rent Price"
//             fullWidth
//             {...register("rentPrice", { required: "Campo Requerido" })}
//             error={!!errors.rentPrice}
//             helperText={errors.rentPrice?.message}
//           />
//         </Grid>
//         <Grid sx={{ margin: 2 }}>
//           <TextField
//             label="Date Available"
//             placeholder="Date Available"
//             fullWidth
//             {...register("dateAvailable", { required: "Campo Requerido" })}
//             error={!!errors.dateAvailable}
//             helperText={errors.dateAvailable?.message}
//           />
//         </Grid>

//         <Grid sx={{ margin: 2 }}>
//           <Typography variant="body1">Subir Imagen</Typography>
//           <input type="file" onChange={handleImageChange} accept="image/*" />
//         </Grid>

//         <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
//           <Grid size={{ sm: 6, xs: 12 }}>
//             <Button variant="contained" fullWidth type="submit">
//               Registrar
//             </Button>
//           </Grid>
//         </Grid>



//       </form>
//     </FlatLayout>
//   );
// };