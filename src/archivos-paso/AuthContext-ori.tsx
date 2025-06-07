import React, { createContext, useContext, useEffect, useState } from "react";
import type { AppUser } from "../interfaces/AppUser";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { getCurrentUserData, loginUser, loginWithGoogle, logoutUser, registerUser } from "../services/AuthServices";

interface AuthContextProps {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser | null>;
  registro: (email: string, password: string, firstName: string, lastName: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  loginWithGoogleContext: ()=> Promise<AppUser>
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  login: async() => null,
  registro: async()=> {
    throw new Error('Funcion no implementada')
  },
  logout: async() => {},
  loginWithGoogleContext: async () => {
    console.warn('loginWithGoogle fuera del provider');
    return {
      uid: '',
      email: '',
      firstName: '',
      lastName: '',
    };
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await getCurrentUserData(firebaseUser.uid);
          if (userData) setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    const login = async (email: string, password: string): Promise<AppUser | null> => {
      const userData = await loginUser(email, password);
      if (userData) setUser(userData);
      return userData;
    };
  
    const registro = async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ): Promise<AppUser> => {
      const newUser = await registerUser(email, password, firstName, lastName);
      setUser(newUser);
      return newUser;
    };
  
    const logout = async () => {
      await logoutUser();
      setUser(null);
    };

    const loginWithGoogleContext = async() =>{
        const userData = await loginWithGoogle();
        setUser(userData);
        return userData;
    }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registro,
        logout,
        loginWithGoogleContext
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuthContext = () => useContext(AuthContext);