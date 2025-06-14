export interface ProductCardProps {
  id?: string;
  city: string;
  streetName: string;
  streetNumber: string;
  areaSize: number;
  hasAC: string;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  src: string;
  alt: string;
  userId: string;
  isFavourite?: boolean;
  onDelete?: () => void;
}
