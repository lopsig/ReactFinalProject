
import { db } from "../../firebase/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth } from "../../firebase/firebase"; // 
import { onSnapshot } from "firebase/firestore";



export interface Flat {
  id?: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  dateAvailable: string;
  userId: string;
  src: string;
  alt: string;
}

// Registrar nuevo Flat con userId
export const registerFlat = async (
  city: string,
  streetName: string,
  streetNumber: number,
  areaSize: number,
  hasAC: boolean,
  yearBuilt: number,
  rentPrice: number,
  dateAvailable: string,
  src: string,
  alt: string,
  userId: string,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const newFlat: Flat = {
    city,
    streetName,
    streetNumber,
    areaSize,
    hasAC,
    yearBuilt,
    rentPrice,
    dateAvailable,
    src,
    userId: user.uid, 
  };

  const flatsCollection = collection(db, "flats");
  const docRef = await addDoc(flatsCollection, newFlat);

  console.log("Documento guardado con ID:", docRef.id);
  return { ...newFlat, id: docRef.id };
};

// Obtener flats del usuario actual
export const getFlatsByUserId = async (): Promise<Flat[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const flatsCollection = collection(db, "flats");
    const q = query(flatsCollection, where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Flat[];
  } catch (error) {
    console.error("Error al cargar los flats:", error);
    return [];
  }
};

// Elimina un flat por su ID
export const deleteFlat = async (flatId: string) => {
  try {
    await deleteDoc(doc(db, "flats", flatId));
    console.log("Flat eliminado con éxito");
  } catch (error) {
    console.error("Error al eliminar el flat:", error);
    throw error;
  }
};