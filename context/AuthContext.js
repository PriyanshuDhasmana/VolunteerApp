import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { auth } from "../firebaseConfig";

let GoogleAuthentication = null;
let signInWithPopup = null;
if (Platform.OS !== "web") {
  try {
    GoogleAuthentication = require("expo-google-app-auth");
  } catch (error) {
    console.warn("Google Auth not available");
  }
} else {
  // For web, import signInWithPopup dynamically
  try {
    signInWithPopup = require("firebase/auth").signInWithPopup;
  } catch (error) {
    console.warn("signInWithPopup not available");
  }
}

const AuthContext = createContext({});

const demoUserProfile = {
  uid: "demo-volunteer",
  displayName: "Priyanshu Gupta",
  email: "priyanshu@example.com",
  phoneNumber: "555-0123",
  photoURL: null,
  isDemo: true,
};

const demoStorageKey = "volunteerapp.demoUser";

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [demoUser, setDemoUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 1200);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const wantsDemo = new URLSearchParams(window.location.search).get("demo");
      const savedDemoUser = window.localStorage.getItem(demoStorageKey);

      if (wantsDemo === "1") {
        setDemoUser(demoUserProfile);
        window.localStorage.setItem(demoStorageKey, JSON.stringify(demoUserProfile));
      } else if (savedDemoUser) {
        setDemoUser(JSON.parse(savedDemoUser));
      }
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        if (mounted) {
          clearTimeout(fallbackTimer);
          console.log(
            "Auth state changed:",
            currentUser ? currentUser.email : "No user",
          );
          setFirebaseUser(currentUser);
          setLoading(false);
          setError(null);
        }
      },
      (err) => {
        if (mounted) {
          clearTimeout(fallbackTimer);
          console.error("Auth error:", err);
          setError(err);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      console.log("Starting Google Sign-In...");
      if (Platform.OS === "web") {
        if (!signInWithPopup) {
          throw new Error(
            "Google Sign-In not available on web. Please check Firebase setup.",
          );
        }
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log("Google Sign-In successful (web)");
        setFirebaseUser(result.user);
        setError(null);
        return result;
      } else {
        // Native (Android/iOS)
        if (!GoogleAuthentication) {
          throw new Error(
            "Google Sign-In is only available on mobile (Android/iOS). Please use email/password login on web.",
          );
        }
        const result = await GoogleAuthentication.logInAsync({
          iosClientId:
            "611249945069-9retrnc39tv59v0f00bcqibfph6ab3ht.apps.googleusercontent.com",
          androidClientId:
            "611249945069-g65hgos8n5fse41midanqh3jrohaf8mc.apps.googleusercontent.com",
          isUserInteractionRequired: true,
        });
        if (result.type === "success") {
          console.log("Google Sign-In successful");
          const credential = GoogleAuthProvider.credential(
            result.idToken,
            result.accessToken,
          );
          const firebaseResult = await signInWithCredential(auth, credential);
          console.log(
            "Firebase authentication successful:",
            firebaseResult.user.email,
          );
          setFirebaseUser(firebaseResult.user);
          setError(null);
          return firebaseResult;
        } else if (result.type === "cancel") {
          console.log("Google Sign-In cancelled by user");
          throw new Error("User cancelled Google Sign-In");
        }
      }
    } catch (err) {
      console.error("Google Sign-In error:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const continueAsDemo = () => {
    setDemoUser(demoUserProfile);
    setError(null);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.localStorage.setItem(demoStorageKey, JSON.stringify(demoUserProfile));
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setDemoUser(null);

      if (Platform.OS === "web" && typeof window !== "undefined") {
        window.localStorage.removeItem(demoStorageKey);
      }

      await signOut(auth);
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const user = firebaseUser || demoUser;

  return (
    <AuthContext.Provider
      value={{ user, loading, error, signInWithGoogle, continueAsDemo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
