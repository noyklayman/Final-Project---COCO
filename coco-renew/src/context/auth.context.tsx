import React, { useContext, useEffect, useState } from "react";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import {  getDoc, setDoc, doc } from "firebase/firestore";
import { auth, firestore } from "../db"

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);

  const login = async ({ email, password }: any) => {
    setLoading(true);
    const loginResponse = await setPersistence(auth, browserSessionPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    });
    setLoading(false);
    return await getUser(loginResponse.user.uid);
  };

  const register = async (userInfo: any) => {
    setLoading(true);
    const registerResponse = await createUserWithEmailAndPassword(
      auth,
      userInfo.email,
      userInfo.password
    );
    delete userInfo.password;
    const newUserDocument = {
      ...userInfo,
      uid: registerResponse.user.uid,
      image: registerResponse.user.photoURL,
      phone: registerResponse.user.phoneNumber,
      isAdmin: false,
    };

    await setDoc(doc(firestore, `users/${registerResponse.user.uid}`), newUserDocument);
    setUser(newUserDocument);
    setLoading(false);
    return newUserDocument;
  };

  const getUser = async (id: any) => {
    try {
      const snapshot = await getDoc(doc(firestore, `users/${id}`));
      const user = snapshot.data();
      setUser(user as any);
      return user;
    } catch (e) {}
  };
  const logout = async () => {
    await signOut(auth);
    setUser(undefined);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userState) => {
      if (userState) {
        const userDocumentData = await getUser(userState.uid);
        if (userDocumentData) {
          setUser(userDocumentData as any);
        }
        setLoading(false);
      } else {
        setUser(undefined);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadingUser: loading, login, register, logout } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Auth context not provided");
  }
  return context;
};
