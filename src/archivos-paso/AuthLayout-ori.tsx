import { Grid, Typography } from "@mui/material"
import type { ReactNode} from "react"

interface AuthLayoutProps {
  children: ReactNode,
  description: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  description = "",
}) => {
  return (
    <Grid 
      container
      spacing={1}
      alignItems="center"
      justifyContent="center"
      sx={{
        margin: 1, 
        padding: 2, 
        minHeight: "calc(100vh - 20px)", 
        boxSizing: "border-box",
        bgcolor: '#cfe8fc'
      }}
    >
      <Grid
        sx={{
          width: {sm: 450},
          background: "#eee",
          padding: 4,
          borderRadius: 2,
          textAlign: "center",
          border: "1px red solid"
        }}
      >
        <Typography variant="body1">{description}</Typography>
        
        {children}
      </Grid>
    </Grid>
  );
};
