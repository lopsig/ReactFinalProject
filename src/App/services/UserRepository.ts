import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { type AppUser } from "../../auth/interfaces/AppUser";

export const deleteUserFromFirestore = async (uid: string) => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};

// Obtener datos del usuario desde Firestore
export const getUserData = async (): Promise<AppUser | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return { uid: userDoc.id, ...userDoc.data() } as AppUser;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return null;
  }
};

// Actualizar datos del usuario
export const updateUserData = async (uid: string, data: Partial<AppUser>) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
    console.log("Perfil actualizado");
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
};
