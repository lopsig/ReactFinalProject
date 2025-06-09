import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import type { AppUser } from "../interfaces/AppUser";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";



export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  birthDate: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { uid } = userCredential.user;
    const newUser: AppUser = { uid, email, firstName, lastName,birthDate };

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

export const getCurrentUserData = async (uid: string): Promise<AppUser | null> => {
  const userDoc = await getDoc(doc(db, "users", uid));

  if (userDoc.exists()) {
    return userDoc.data() as AppUser
  }
  return null
}

export const loginWithGoogle = async (): Promise<AppUser> => {

  const provider = new GoogleAuthProvider

  const result = await signInWithPopup(auth, provider)

  console.log("Resultado: ", result)


  const { user } = result

  
  const userInfo = getAdditionalUserInfo(result)
  const isNewUser = userInfo?.isNewUser

  const userData: AppUser = {
    uid: user.uid,
    email: user.email ?? "",

    firstName: user.displayName?.split(" ")[0] ?? "",
    lastName: user.displayName?.split(" ")[1] ?? "",
  };

  if (isNewUser) {
    await getDoc(doc(db, "users", user.uid));
  }


  return userData;


};
