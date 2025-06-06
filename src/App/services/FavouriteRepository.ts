
import { setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { type ProductCardProps } from "../interfaces/ProductCardPropos";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";


export const addFavourite = async (flat: ProductCardProps) => {
  const user = auth.currentUser;
  if (!user) return;

  const favRef = doc(db, "favourites", `${user.uid}_${flat.id}`);
  await setDoc(favRef, {
    userId: user.uid,
    flatId: flat.id,
    addedAt: new Date(),
  });
};


export const removeFavourite = async (flatId: string) => {
  const user = auth.currentUser;
  if (!user) return;

  const favRef = doc(db, "favourites", `${user.uid}_${flatId}`);
  await deleteDoc(favRef);
};




export const isFavouriteInFirebase = async (
  flatId: string
): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const favRef = doc(db, "favourites", `${user.uid}_${flatId}`);
  const snapshot = await getDoc(favRef);
  return snapshot.exists();
};




// Función para obtener los favoritos del usuario logueado
export const getFavouritesFromFirebase = async (): Promise<ProductCardProps[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    // Paso 1: Obtener todos los favoritos del usuario
    const q = query(collection(db, "favourites"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    const flatsPromises = snapshot.docs.map(async (favDoc) => {
      const favData = favDoc.data();

      // Paso 2: Verificar que flatId exista
      if (!favData.flatId) {
        console.warn("Documento sin flatId:", favDoc.id);
        return null;
      }

      // Paso 3: Traer cada flat correspondiente
      const flatSnapshot = await getDoc(doc(db, "flats", favData.flatId));

      if (flatSnapshot.exists()) {
        return {
          id: flatSnapshot.id,
          ...flatSnapshot.data(),
        };
      }

      return null;
    });

    const flats = await Promise.all(flatsPromises);
    return flats.filter(Boolean) as ProductCardProps[];
  } catch (error) {
    console.error("Error al cargar los favoritos:", error);
    return [];
  }
};