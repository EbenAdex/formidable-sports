import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  createUserProfile,
  ensureUserProfile,
} from "../services/profileService";

const AuthContext = createContext();

const ADMIN_EMAIL = "admin@formidablesports.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_STORAGE_KEY = "formidableSportsAdminOverride";
const INACTIVITY_LIMIT = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [adminOverride, setAdminOverride] = useState(
    localStorage.getItem(ADMIN_STORAGE_KEY) === "true"
  );

  const inactivityTimerRef = useRef(null);

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const logout = async (redirectToLogin = true) => {
    clearInactivityTimer();
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminOverride(false);
    setUser(null);
    setHasRegistered(false);

    if (auth.currentUser) {
      await signOut(auth);
    }

    if (redirectToLogin) {
      window.location.href = "/login";
    }
  };

  const resetInactivityTimer = () => {
    clearInactivityTimer();

    if (!user) return;

    inactivityTimerRef.current = setTimeout(async () => {
      alert("You have been logged out due to 30 minutes of inactivity.");
      await logout(true);
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await ensureUserProfile({
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || "N/A",
            department: "N/A",
            level: "N/A",
            role: "user",
          });

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
      } catch (error) {
        console.error("Auth state profile load failed:", error);
        setUser(null);
        setHasRegistered(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      clearInactivityTimer();
      return;
    }

    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetInactivityTimer();
    };

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity);
    });

    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      clearInactivityTimer();
    };
  }, [user]);

  const register = async ({ email, password, fullName, department, level }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    await createUserProfile({
      fullName,
      email,
      department,
      level,
      role: "user",
    });

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

    const profile = await ensureUserProfile({
      email: firebaseUser.email,
      fullName: firebaseUser.displayName || "N/A",
      department: "N/A",
      level: "N/A",
      role: "user",
    });

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

  const isAdmin =
    adminOverride || user?.role === "admin" || user?.email === ADMIN_EMAIL;

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
      resetInactivityTimer,
    }),
    [user, loading, hasRegistered, adminOverride, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}