import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { loginWithGoogle } from "../services/AuthServices";

// Tipo para nuestro usuario extendido
interface AppUser {
  uid: string;
  email: string | null;
  role: string;
}

// Contexto
interface AuthContextType {
  user: AppUser | null;
  loading : boolean,
  // login: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<AppUser | null>;
  // register: (
  //   email: string,
  //   password: string
  // ) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, firstName: string, lastName:string) => Promise<AppUser>;
  logout: () => Promise<void>;
  loginWithGoogleContext:() => Promise<AppUser>
}

// export const AuthContext = createContext<AuthContextType | null>(null);



export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => null,
  register: async () => {
    throw new Error("Funcion no implementad");
  },
  logout: async () => {},
  loginWithGoogleContext: async () => {
    console.warn("loginWithGoogle fuera del provider")
    return {
      uid: "",
      email: "",
      firstName: "",
      lastName: ""
    }
  }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  // Detecta sesión activa
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        const role = docSnap.exists() ? docSnap.data().role : "user";

        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      const role = docSnap.exists() ? docSnap.data().role : "user";

      const appUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role,
      };

      console.log("Usuario logueado:", appUser);
      setUser(appUser);

      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Guardar en Firestore con rol por defecto
      await setDoc(doc(db, "users", uid), {
        email,
        role: "user",
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const loginWithGoogleContext = async () => {
    const userData = await loginWithGoogle()
    setUser(userData)
    return userData

  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, loginWithGoogleContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para usar el contexto
// export const useAuth = () => useContext(AuthContext)!;
