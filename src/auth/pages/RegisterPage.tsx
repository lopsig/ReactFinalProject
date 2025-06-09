import { Grid, TextField, Button, Link } from "@mui/material";
import { AuthLayout } from "../component/AuthLayout";
// import GoogleIcon from "@mui/icons-material/Google";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { registerUser } from "../services/AuthServices";




type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  birthDate: string
};

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password != data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const user = await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.birthDate
      );
      console.log("Usuario registrado:", user);
      navigate("auth/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout description="Register Page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Email"
            type="email"
            placeholder="email@correo.com"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register("email", {
              required: "Email requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: " Email no valido",
              },
            })}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Password"
            type="password"
            placeholder="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            {...register("password", {
              required: "Contraseña requerida",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/,
                message:
                  "La contraseña debe de tener letras, números y un caracter especial",
              },
              minLength: {
                value: 6,
                message: "Minimo 6 caracteres",
              },
            })}
          />
        </Grid>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Confirmar Contraseña",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            })}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="First Name"
            placeholder="First Name"
            fullWidth
            {...register("firstName", { required: "Nombre requerido" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Last Name"
            placeholder="Last Name"
            fullWidth
            {...register("lastName", { required: "Apellido requerido" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            type="date"
            placeholder="Birth Date"
            fullWidth
            {...register("birthDate", { required: "Fecha de nacimiento requerida" })}
            error={!!errors.birthDate}
            helperText={errors.birthDate?.message}
          />
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid size={{ sm: 6, xs: 12 }}>
            <Button variant="contained" fullWidth type="submit">
              Registrar
            </Button>
          </Grid>
          {/* 
          <Grid size={{ sm: 6, xs: 12 }}>
            <Button variant="contained" fullWidth startIcon={<GoogleIcon />}>
              Google
            </Button>
          </Grid> */}

          <Grid container direction="row" justifyContent="end">
            <Link component={RouterLink} color="inherit" to="/auth/login">
              Ya tienes una cuenta? Log In
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
