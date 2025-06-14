import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FlatCard } from "../components/FlatCard";
import { getAllFlatsFromFirebase } from "../../services/FlatRepository";
import {
  Box,
  Container,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Avatar,
  Card,
  Paper,
} from "@mui/material";
import type { ProductCardProps } from "../interfaces/ProductCardPropos";

interface FilterState {
  city: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
}

export const HomePage: React.FC = () => {
  const [flats, setFlats] = useState<ProductCardProps[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    city: "",
    minPrice: undefined,
    maxPrice: undefined,
    minArea: undefined,
    maxArea: undefined,
  });
  const [sortOption, setSortOption] = useState<
    "city" | "priceAsc" | "priceDesc" | "areaAsc" | "areaDesc"
  >("city");

  const navigate = useNavigate();

  const onNavigate = (p: ProductCardProps) => {
    navigate(`/item/${encodeURIComponent(p.id)}`, { state: p });
  };

  useEffect(() => {
    const loadFlats = async () => {
      const data = await getAllFlatsFromFirebase();
      setFlats(data);
    };

    loadFlats();
  }, []);

  //////////////////////////////

  const applyFiltersAndSorting = () => {
    return flats
      .filter((flat) => {
        if (
          filters.city &&
          !flat.city.toLowerCase().includes(filters.city.toLowerCase())
        )
          return false;
        if (filters.minPrice !== undefined && flat.rentPrice < filters.minPrice)
          return false;
        if (filters.maxPrice !== undefined && flat.rentPrice > filters.maxPrice)
          return false;
        if (filters.minArea !== undefined && flat.areaSize < filters.minArea)
          return false;
        if (filters.maxArea !== undefined && flat.areaSize > filters.maxArea)
          return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "city":
            return a.city.localeCompare(b.city);
          case "priceAsc":
            return a.rentPrice - b.rentPrice;
          case "priceDesc":
            return b.rentPrice - a.rentPrice;
          case "areaAsc":
            return a.areaSize - b.areaSize;
          case "areaDesc":
            return b.areaSize - a.areaSize;
          default:
            return 0;
        }
      });
  };
  const filteredFlats = applyFiltersAndSorting();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      city: e.target.value,
    });
  };

  // const handlePriceChange = (_: Event, newValue: number[] | number) => {
  //   const [min, max] = Array.isArray(newValue)
  //     ? newValue
  //     : [newValue, newValue + 50];
  //   setFilters({
  //     ...filters,
  //     minPrice: min,
  //     maxPrice: max,
  //   });
  // };

  // const handleAreaChange = (_: Event, newValue: number[] | number) => {
  //   const [min, max] = Array.isArray(newValue)
  //     ? newValue
  //     : [newValue, newValue + 50];
  //   setFilters({
  //     ...filters,
  //     minArea: min,
  //     maxArea: max,
  //   });
  // };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as
      | "city"
      | "priceAsc"
      | "priceDesc"
      | "areaAsc"
      | "areaDesc";
    setSortOption(value);
  };

  const departamentosRef = useRef<HTMLDivElement>(null);
  const testimoniosRef = useRef<HTMLDivElement>(null);
  const contactosRef = useRef<HTMLDivElement>(null);

  ///////////////////////////////
  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          minHeight: "95vh",
          bgcolor: "#f5f7fa",
          display: "flex",
          alignItems: "center",
          py: { xs: 6, md: 15 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Texto principal */}
            <Grid container xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Encuentra el departamento perfecto <br />
                para <span style={{ color: "#1976d2" }}>vivir tranquilo</span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  mb: 4,
                }}
              >
                Explora cientos de opciones en todo el Ecuador. Departamentos
                verificados, procesos claros y sin complicaciones.
              </Typography>

              <Button
                variant="contained"
                size="large"
                color="primary"
                sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
                onClick={() => {
                  departamentosRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Ver departamentos
              </Button>

              <Button
                variant="contained"
                size="large"
                color="primary"
                sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
                onClick={() => {
                  testimoniosRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Testimonios
              </Button>

              <Button
                variant="contained"
                size="large"
                color="primary"
                sx={{ borderRadius: 2, textTransform: "none", px: 4 }}
                onClick={() => {
                  contactosRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Contáctanos
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN: Ver Departamentos */}

      <Box sx={{ bgcolor: "#fff", py: 12 }} ref={departamentosRef}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            textAlign="center"
          >
            Departamentos Disponibles
          </Typography>

          {/*Filtros*/}

          <Box sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom
              sx={{mb:2}}
              >
                Filtros de Búsqueda
              </Typography>

              <Grid container spacing={2} justifyContent={"center"}>
                {/* Ciudad */}
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Ciudad"
                    variant="outlined"
                    size="small"
                    value={filters.city}
                    onChange={handleCityChange}
                    fullWidth
                    sx={{ width: 150 }}
                  />
                </Grid>

                {/* Ordenar por */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortOption}
                      onChange={handleSortChange}
                      label="Ordenar por"
                    >
                      <MenuItem value="city">Ciudad (A-Z)</MenuItem>
                      <MenuItem value="priceAsc">Precio ascendente</MenuItem>
                      <MenuItem value="priceDesc">Precio descendente</MenuItem>
                      <MenuItem value="areaAsc">Área ascendente</MenuItem>
                      <MenuItem value="areaDesc">Área descendente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Precio Min/Max */}
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Precio Mínimo"
                    type="number"
                    size="small"
                    fullWidth
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    sx={{ width: 130 }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Precio Máximo"
                    type="number"
                    size="small"
                    fullWidth
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    sx={{ width: 130 }}
                  />
                </Grid>

                {/* Área Min/Max */}
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Área Mínima"
                    type="number"
                    size="small"
                    fullWidth
                    value={filters.minArea || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minArea: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    sx={{ width: 130 }}
                  />
                </Grid>
                <Grid item xs={6} sm={6} md={3}>
                  <TextField
                    label="Área Máxima"
                    type="number"
                    size="small"
                    fullWidth
                    value={filters.maxArea || ""}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxArea: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    sx={{ width: 130 }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Lista de Flats filtrados */}
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {filteredFlats.length === 0 ? (
              <Typography>No se encontraron flats con esos filtros.</Typography>
            ) : (
              filteredFlats.map((flat) => (
                <Grid size={{ xs: 2, sm: 4, md: 4 }} key={flat.id}>
                  <Box
                    onClick={() => onNavigate(flat)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    <FlatCard {...flat} />
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN: Testimonios */}
      <Box sx={{ bgcolor: "#f0f4f8", py: 10 }} ref={testimoniosRef}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            fontWeight={600}
            textAlign="center"
            gutterBottom
          >
            Lo que dicen nuestros usuarios
          </Typography>

          <Grid container spacing={4} mt={3} justifyContent={"center"}>
            {[1, 2, 3].map((id) => (
              <Grid item xs={12} sm={4} key={id}>
                <Card sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    “Encontré el depa ideal en solo 3 días. Todo el proceso fue
                    fácil y transparente.”
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar src={`/images/user${id}.jpg`} />
                    <Box ml={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Usuario {id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Quito, Ecuador
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* SECCIÓN: Contáctanos */}
      <Box sx={{ bgcolor: "#fff", py: 10 }} ref={contactosRef}>
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            fontWeight={600}
            textAlign="center"
            gutterBottom
          >
            Contáctanos
          </Typography>

          <Typography textAlign="center" mb={4} color="text.secondary">
            ¿Tienes dudas o necesitas ayuda? Estamos aquí para ayudarte.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nombre" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo electrónico"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mensaje"
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                color="primary"
              >
                Enviar mensaje
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Container>
  );
};
