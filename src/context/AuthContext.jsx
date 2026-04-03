import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

const ADMIN_EMAIL = "admin@formidablesports.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_STORAGE_KEY = "formidableSportsAdminOverride";
const USER_STORAGE_KEY = "formidableSportsUser";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [adminOverride, setAdminOverride] = useState(
    localStorage.getItem(ADMIN_STORAGE_KEY) === "true"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setHasRegistered(true);
      } else {
        const savedAdminUser = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");

        if (
          localStorage.getItem(ADMIN_STORAGE_KEY) === "true" &&
          savedAdminUser?.role === "admin"
        ) {
          setUser(savedAdminUser);
          setHasRegistered(true);
        } else {
          setUser(null);
          setHasRegistered(false);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async ({ email, password }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const login = async ({ email, password }) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        email: ADMIN_EMAIL,
        role: "admin",
        fullName: "Admin",
      };

      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));

      setAdminOverride(true);
      setUser(adminUser);
      setHasRegistered(true);

      return { isAdminOverride: true, user: adminUser };
    }

    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminOverride(false);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    localStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify({
        email: firebaseUser.email,
        role: "user",
        fullName: firebaseUser.displayName || "User",
      })
    );

    return firebaseUser;
  };

  const logout = async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setAdminOverride(false);
    setUser(null);
    setHasRegistered(false);

    if (auth.currentUser) {
      await signOut(auth);
    }
  };

  const isAdmin = adminOverride || user?.role === "admin" || user?.email === ADMIN_EMAIL;

  const value = useMemo(
    () => ({
      user,
      loading,
      hasRegistered,
      adminOverride,
      isAdmin,
      register,
      login,
      logout,
    }),
    [user, loading, hasRegistered, adminOverride, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}