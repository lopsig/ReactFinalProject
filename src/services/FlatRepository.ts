import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface ProductCardProps {
  id: string;
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

export const getAllFlatsFromFirebase = async (): Promise<
  ProductCardProps[]
> => {
  try {
    const flatsRef = collection(db, "flats");
    const snapshot = await getDocs(query(flatsRef));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProductCardProps[];
  } catch (error) {
    console.error("Error al cargar los flats:", error);
    return [];
  }
};
