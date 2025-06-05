import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import type { AppUser } from "../interfaces/AppUser";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { uid } = userCredential.user;
    const newUser: AppUser = { uid, email, firstName, lastName };

    await setDoc(doc(db, "users", uid), newUser);

    return newUser;
  } catch (error) {
    // Manejo de errores personalizado
    if (error.code === "auth/email-already-in-use") {
      throw new Error("El correo ya está en uso");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Correo inválido");
    } else if (error.code === "auth/operation-not-allowed") {
      throw new Error("Operación no permitida");
    } else if (error.code === "auth/weak-password") {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    } else {
      throw new Error("Error desconocido al registrar usuario");
    }
  }

};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const uid = userCredential.user.uid;

  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as AppUser;
  }

  return null;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerró sesión");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export const loginWithGoogle = async () => {};
