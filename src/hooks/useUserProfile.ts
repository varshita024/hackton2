import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
  createdAt: string;
  uid: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        setError("No authenticated user found");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : {};
        
        const p: UserProfile = {
          uid: user.uid,
          fullName: data.fullName || user.displayName || "User",
          email: user.email || "",
          phone: data.phone || "",
          gender: data.gender || "prefer-not-to-say",
          role: data.role || "user",
          createdAt: data.createdAt?.toDate?.()?.toLocaleDateString("en-IN", { 
            day: "numeric", 
            month: "short", 
            year: "numeric" 
          }) || "",
        };
        
        setProfile(p);
        setError(null);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to fetch user data from Firestore");
        
        // Fallback to Auth data only
        setProfile({
          uid: user.uid,
          fullName: user.displayName || "User",
          email: user.email || "",
          phone: "",
          gender: "prefer-not-to-say",
          role: "user",
          createdAt: "",
        });
      }
      
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { profile, loading, error };
}
