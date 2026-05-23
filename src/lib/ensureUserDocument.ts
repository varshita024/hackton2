import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Ensures the current user's Firestore document has all required fields.
 * Call this after user authentication to guarantee data completeness.
 * 
 * This can be called from a useEffect in any component after authentication.
 */
export async function ensureUserDocumentComplete() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDocRef = doc(db, "users", user.uid);
    const snap = await getDoc(userDocRef);
    
    if (!snap.exists()) {
      // Document doesn't exist, create it with basic info
      await updateDoc(userDocRef, {
        uid: user.uid,
        fullName: user.displayName || "User",
        email: user.email || "",
        phone: "",
        gender: "prefer-not-to-say",
        role: "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Document exists, check for missing fields and update
      const data = snap.data();
      const updates: Record<string, any> = {
        updatedAt: serverTimestamp(),
      };

      if (!data.gender) {
        updates.gender = "prefer-not-to-say";
      }
      if (!data.role) {
        updates.role = "user";
      }
      if (!data.fullName && user.displayName) {
        updates.fullName = user.displayName;
      }
      if (!data.email && user.email) {
        updates.email = user.email;
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 1) {
        await updateDoc(userDocRef, updates);
      }
    }

    return await getDoc(userDocRef);
  } catch (error) {
    console.error("Error ensuring user document completeness:", error);
    return null;
  }
}

/**
 * Updates a specific field in the user's Firestore document.
 * Use this to update individual fields without modifying the entire document.
 */
export async function updateUserField(field: string, value: any) {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    await updateDoc(doc(db, "users", user.uid), {
      [field]: value,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating user field ${field}:`, error);
    return false;
  }
}
