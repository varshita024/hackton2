import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Sets up the Firestore collections and indexes needed for the dashboard.
 * Call this once to initialize the database structure.
 */
export async function setupDashboardCollections() {
  const user = auth.currentUser;
  if (!user) {
    console.error("No authenticated user");
    return false;
  }

  try {
    // Create a sample transaction document to establish the collection
    const transactionRef = doc(collection(db, "transactions"));
    await setDoc(transactionRef, {
      userId: user.uid,
      amount: 0,
      fraudType: "sample",
      status: "sample",
      riskScore: 0,
      timestamp: serverTimestamp(),
    });

    // Create a sample alert document to establish the collection
    const alertRef = doc(collection(db, "alerts"));
    await setDoc(alertRef, {
      userId: user.uid,
      title: "Sample Alert",
      description: "This is a sample alert to establish the collection",
      severity: "low",
      timestamp: serverTimestamp(),
    });

    console.log("Dashboard collections initialized");
    return true;
  } catch (error) {
    console.error("Error setting up dashboard collections:", error);
    return false;
  }
}

/**
 * Adds a sample transaction for testing purposes.
 */
export async function addSampleTransaction(data: {
  amount: number;
  fraudType: string;
  status: string;
  riskScore: number;
}) {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const transactionRef = doc(collection(db, "transactions"));
    await setDoc(transactionRef, {
      userId: user.uid,
      amount: data.amount,
      fraudType: data.fraudType,
      status: data.status,
      riskScore: data.riskScore,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error adding sample transaction:", error);
    return false;
  }
}

/**
 * Adds a sample alert for testing purposes.
 */
export async function addSampleAlert(data: {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}) {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    const alertRef = doc(collection(db, "alerts"));
    await setDoc(alertRef, {
      userId: user.uid,
      title: data.title,
      description: data.description,
      severity: data.severity,
      timestamp: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error adding sample alert:", error);
    return false;
  }
}

/**
 * Populates sample data for dashboard testing.
 */
export async function populateSampleData() {
  const user = auth.currentUser;
  if (!user) return false;

  try {
    // Add sample transactions
    const sampleTransactions = [
      { amount: 4521, fraudType: "None", status: "Approved", riskScore: 2 },
      { amount: 12890, fraudType: "Suspicious Location", status: "Reviewing", riskScore: 78 },
      { amount: 8234, fraudType: "Velocity Exceeded", status: "Flagged", riskScore: 94 },
      { amount: 2345, fraudType: "None", status: "Approved", riskScore: 5 },
      { amount: 45678, fraudType: "New Device", status: "Reviewing", riskScore: 65 },
    ];

    for (const tx of sampleTransactions) {
      await addSampleTransaction(tx);
    }

    // Add sample alerts
    const sampleAlerts = [
      {
        title: "Suspicious Transaction Detected",
        description: "Transaction of $45,000 from unusual IP location",
        severity: "high" as const,
      },
      {
        title: "Unusual Location Activity",
        description: "Multiple transactions from different geographic locations",
        severity: "medium" as const,
      },
      {
        title: "Multiple Failed Login Attempts",
        description: "15 failed attempts from same IP address",
        severity: "high" as const,
      },
      {
        title: "Velocity Limit Exceeded",
        description: "Transaction velocity threshold exceeded",
        severity: "medium" as const,
      },
    ];

    for (const alert of sampleAlerts) {
      await addSampleAlert(alert);
    }

    console.log("Sample data populated successfully");
    return true;
  } catch (error) {
    console.error("Error populating sample data:", error);
    return false;
  }
}
