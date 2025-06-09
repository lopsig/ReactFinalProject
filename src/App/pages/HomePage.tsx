import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlatCard } from "../components/FlatCard";
import { getAllFlatsFromFirebase } from "../../services/FlatRepository";
import { Box, Container, Grid, TextField, MenuItem, Select, FormControl, InputLabel, Typography, Slider } from "@mui/material";
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

  const handlePriceChange = (_: Event, newValue: number[] | number) => {
    const [min, max] = Array.isArray(newValue)
      ? newValue
      : [newValue, newValue + 50];
    setFilters({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleAreaChange = (_: Event, newValue: number[] | number) => {
    const [min, max] = Array.isArray(newValue)
      ? newValue
      : [newValue, newValue + 50];
    setFilters({
      ...filters,
      minArea: min,
      maxArea: max,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as
      | "city"
      | "priceAsc"
      | "priceDesc"
      | "areaAsc"
      | "areaDesc";
    setSortOption(value);
  };



  
///////////////////////////////
  return (
    <Container sx={{ py: 4 }}>
      <Box>
        {/* Filtro por ciudad */}
        <TextField
          label="Filtrar por ciudad"
          variant="outlined"
          value={filters.city}
          onChange={handleCityChange}
        />

        {/* Filtro por precio */}
        <Box sx={{ px: 2 }}>
          <Typography gutterBottom>Precio</Typography>
          <Slider
            min={0}
            max={200}
            step={10}
            value={[filters.minPrice ?? 0, filters.maxPrice ?? 200]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
        </Box>
        {/* Filtro por área */}
        <Box sx={{ px: 2 }}>
          <Typography gutterBottom>Tamaño del Área</Typography>
          <Slider
            min={0}
            max={200}
            step={10}
            value={[filters.minArea ?? 0, filters.maxArea ?? 200]}
            onChange={handleAreaChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-area-slider"
          />
        </Box>
        {/* Ordenar por */}
        <FormControl fullWidth>
          <InputLabel>Ordenar por</InputLabel>
          <Select value={sortOption} onChange={handleSortChange}>
            <MenuItem value="city">Ciudad (A-Z)</MenuItem>
            <MenuItem value="priceAsc">Precio ascendente</MenuItem>
            <MenuItem value="priceDesc">Precio descendente</MenuItem>
            <MenuItem value="areaAsc">Área ascendente</MenuItem>
            <MenuItem value="areaDesc">Área descendente</MenuItem>
          </Select>
        </FormControl>
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
          filteredFlats.map((p) => (
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Box
                onClick={() => onNavigate(p)}
                sx={{
                  cursor: "pointer",
                }}
              >
                <FlatCard {...p} />
              </Box>
            </Grid>
          ))
        )}
      </Grid>
      {/* <Grid container spacing={3} justifyContent="center">
        {filteredFlats.length === 0 ? (
          <Typography>No se encontraron flats con esos filtros.</Typography>
        ) : (
          filteredFlats.map((p, flat) => (
            <Grid item xs={12} sm={6} md={4} key={flat.id}>
              <Box
                onClick={() => onNavigate(p)}
                sx={{
                  cursor: "pointer"
                }}
              >
                <FlatCard {...p} />
              </Box>
            </Grid>
          ))
        )}
      </Grid> */}
    </Container>
  );
};
