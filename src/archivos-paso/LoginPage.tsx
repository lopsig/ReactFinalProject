// LoginPage.tsx
import { Button, Grid, Link, TextField } from "@mui/material";
import { Google } from "@mui/icons-material";
import { AuthLayout } from "../component/AuthLayout";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../context/AuthContext";

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

  const { login, loginWithGoogleContext } = useAuthContext();

  const onSubmit = async (data: LoginFormData) => {
    console.log("LoginForm data:", data);

    try {
      const user = await login(data.email, data.password);
      if (user) {
        console.log("Usuario logueado:", user);
        navigate("/");
      } else {
        console.log("No se encontró el usuario en Firestore");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogleContext();
      if(user) navigate('/', {replace: true})
    } catch (error) {
      console.log("Error con login de google: ", error);
    }
  };

  return (
    <AuthLayout description="Login Page">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid sx={{ margin: 2 }}>
          <TextField
            label="Email"
            type="email"
            placeholder="email@mail.com"
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
            placeholder="********"
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Google />}
              onClick={handleGoogleLogin}
            >
              Google
            </Button>
          </Grid>

          <Grid container direction="row" justifyContent="end">
            <Link component={RouterLink} color="inherit" to="/auth/register">
              No tienes cuenta? Registrarse
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};