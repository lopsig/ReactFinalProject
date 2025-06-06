export interface ProductCardProps {
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
  isFavourite?: boolean;
}
