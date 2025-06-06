import { Grid, TextField, Button, Link } from "@mui/material";
import { AuthLayout } from "../component/AuthLayout";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser } from "../services/AuthServices";



interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();

  
  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data: ", data);

    try {
      const user = await loginUser(data.email, data.password);
      if (user) {
        console.log("Usuario Logueado", user);
        const fullName = `${user.firstName} ${user.lastName}`;
        localStorage.setItem("actualUser", fullName);

        navigate("/");
      } else {
        console.log("No se encotró el usuario en Firestore");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout description="Login Page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Email"
            type="email"
            placeholder="email@correo.com"
            fullWidth
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo no válido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Password"
            type="password"
            placeholder="password"
            fullWidth
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid size={{ sm: 6, xs: 12 }}>
            <Button variant="contained" fullWidth type="submit">
              Login
            </Button>
          </Grid>

          {/* <Grid size={{ sm: 6, xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<GoogleIcon />}
             
            >
              Google
            </Button>
          </Grid> */}

          <Grid container direction="row" justifyContent="end">
            <Link component={RouterLink} color="inherit" to="/auth/register">
              No tienes una cuenta? Registrate
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
