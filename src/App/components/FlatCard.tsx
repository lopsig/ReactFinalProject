import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled,
} from "@mui/material";

// Definimos la interfaz para las props del componente
 interface ProductCardProps {
   id?: string;
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));


export const FlatCard: React.FC<ProductCardProps> = ({
  id,
  city,
  rentPrice,
  dateAvailable,
}) => {
  return (
    <StyledCard>
      {/* Usamos 'src' como placeholder */}
      <CardMedia
        component="img"
        image={city}
        alt={city}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {city}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${rentPrice}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {dateAvailable}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export const FullFlatCard: React.FC<ProductCardProps> = ({
  id,
  city,
  streetName,
  streetNumber,
  areaSize,
  hasAC,
  yearBuilt,
  rentPrice,
  dateAvailable,
}) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        image={city}
        alt={city}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {city}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${rentPrice}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {dateAvailable}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Name: {streetName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Number: {streetNumber}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Area Size: {areaSize}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Has AC: {hasAC ? "Sí" : "No"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Year Built: {yearBuilt}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};
