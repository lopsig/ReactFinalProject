import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

export interface Flat {
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
}

export const registerFlat = async (
  city: string,
  streetName: string,
  streetNumber: number,
  areaSize: number,
  hasAC: boolean,
  yearBuilt: number,
  rentPrice: number,
  dateAvailable: string
) => {
  const newFlat: Flat = {
    city,
    streetName,
    streetNumber,
    areaSize,
    hasAC,
    yearBuilt,
    rentPrice,
    dateAvailable,
  };

  const flatsCollection = collection(db, "flats");
  const docRef = await addDoc(flatsCollection, newFlat);

  console.log("Documento guardado con ID:", docRef.id);
  return newFlat;
};
