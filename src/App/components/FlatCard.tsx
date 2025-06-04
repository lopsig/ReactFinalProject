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
  src: string;
  City: string;
  StreetName: string;
  StreetNumber: number;
  AreaSize: number;
  HasAC: boolean| string;
  YearBuilt: number;
  RentPrice: number;
  DateAvailable: string;
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
  src,
  City,
  StreetName,
  StreetNumber,
  AreaSize,
  HasAC,
  YearBuilt,
  RentPrice,
  DateAvailable,
}) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        image={src}
        alt={src}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {City}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${RentPrice.toFixed(2)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {DateAvailable}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export const FullFlatCard: React.FC<ProductCardProps> = ({
  src,
  City,
  StreetName,
  StreetNumber,
  AreaSize,
  HasAC,
  YearBuilt,
  RentPrice,
  DateAvailable,
}) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        image={src}
        alt={src}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {City}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rent Price: ${RentPrice.toFixed(2)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Date Available: {DateAvailable}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Name: {StreetName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Street Number: {StreetNumber}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Area Size: {AreaSize}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          HasAC: {HasAC}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Year Built: {YearBuilt}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

