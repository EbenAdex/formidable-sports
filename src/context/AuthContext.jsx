import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { getUserProfileByEmail } from "../services/profileService";

const AuthContext = createContext();

const ADMIN_EMAIL = "admin@formidablesports.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_STORAGE_KEY = "formidableSportsAdminOverride";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [adminOverride, setAdminOverride] = useState(
    localStorage.getItem(ADMIN_STORAGE_KEY) === "true"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfileByEmail(firebaseUser.email);

        setUser({
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          role: profile?.role || "user",
          fullName: profile?.fullName || "N/A",
          department: profile?.department || "N/A",
          level: profile?.level || "N/A",
        });

        setHasRegistered(true);
      } else {
        if (localStorage.getItem(ADMIN_STORAGE_KEY) === "true") {
          setUser({
            email: ADMIN_EMAIL,
            role: "admin",
            fullName: "Admin",
            department: "N/A",
            level: "N/A",
          });
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
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");

      const adminUser = {
        email: ADMIN_EMAIL,
        role: "admin",
        fullName: "Admin",
        department: "N/A",
        level: "N/A",
      };

      setAdminOverride(true);
      setUser(adminUser);
      setHasRegistered(true);

      return { isAdminOverride: true, user: adminUser };
    }

    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminOverride(false);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const profile = await getUserProfileByEmail(firebaseUser.email);

    const mergedUser = {
      email: firebaseUser.email,
      uid: firebaseUser.uid,
      role: profile?.role || "user",
      fullName: profile?.fullName || "N/A",
      department: profile?.department || "N/A",
      level: profile?.level || "N/A",
    };

    setUser(mergedUser);
    setHasRegistered(true);

    return mergedUser;
  };

  const logout = async () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
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