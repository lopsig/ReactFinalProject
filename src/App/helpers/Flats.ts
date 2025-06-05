const Flats = [
  {
    src: "../../src/assets/images/01.jpg",
    City: "Quito",
    StreetName: "Wilma Andrade",
    StreetNumber: 123,
    AreaSize: 15,
    HasAC: "Si",
    YearBuilt: 2020,
    RentPrice: 29.99,
    DateAvailable: "25Jun2025",
  },
  {
    src: "../../src/assets/images/02.jpg",
    City: "Biblian",
    StreetName: "Calle San Camilo",
    StreetNumber: 456,
    AreaSize: 12,
    HasAC: "No",
    YearBuilt: 2018,
    RentPrice: 59.99,
    DateAvailable: "04Jun2025",
  },
  {
    src: "../../src/assets/images/03.jpg",
    City: "Guayaquil",
    StreetName: "Bahia",
    StreetNumber: 789,
    AreaSize: 23,
    HasAC: "Si",
    YearBuilt: 2022,
    RentPrice: 32,
    DateAvailable: "12Sep2025",
  },

];

export const getFlatList = () => {
  return Flats;
};
