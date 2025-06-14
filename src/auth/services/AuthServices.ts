import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import type { AppUser } from "../interfaces/AppUser";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";





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
    console.log("Error:",{error})

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
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  console.log("Resultado: ", result);

  const { user } = result;

  const userInfo = getAdditionalUserInfo(result);
  const isNewUser = userInfo?.isNewUser;

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

// Cambia la contraseña del usuario autenticado
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const authInstance = getAuth();
  const user = authInstance.currentUser;

  if (!user) throw new Error("No hay sesión iniciada");

  // 1. Reautenticar con contraseña actual
  const credential = EmailAuthProvider.credential(user.email!, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // 2. Actualizar contraseña
  await updatePassword(user, newPassword);

  return true;
};