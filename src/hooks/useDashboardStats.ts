import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, getCountFromServer, Timestamp } from "firebase/firestore";

interface DashboardStats {
  totalTransactions: number;
  safeTransactions: number;
  riskyTransactions: number;
  fraudPercentage: number;
  protectedUsers: number;
  liveTransactionCount: number;
}

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  fraudType: string;
  status: string;
  riskScore: number;
  timestamp: Timestamp;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  timestamp: Timestamp;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    safeTransactions: 0,
    riskyTransactions: 0,
    fraudPercentage: 0,
    protectedUsers: 0,
    liveTransactionCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch transactions count
        const transactionsRef = collection(db, "transactions");
        const totalSnapshot = await getCountFromServer(transactionsRef);
        const total = totalSnapshot.data().count;

        // Fetch safe transactions (risk score < 40)
        const safeQuery = query(transactionsRef, where("riskScore", "<", 40));
        const safeSnapshot = await getCountFromServer(safeQuery);
        const safe = safeSnapshot.data().count;

        // Fetch risky transactions (risk score >= 40)
        const risky = total - safe;

        // Calculate fraud percentage
        const fraudPercentage = total > 0 ? ((risky / total) * 100).toFixed(1) : 0;

        // Fetch protected users count
        const usersRef = collection(db, "users");
        const usersSnapshot = await getCountFromServer(usersRef);
        const protectedUsers = usersSnapshot.data().count;

        setStats({
          totalTransactions: total,
          safeTransactions: safe,
          riskyTransactions: risky,
          fraudPercentage: parseFloat(fraudPercentage as string),
          protectedUsers,
          liveTransactionCount: Math.floor(Math.random() * 50) + 100, // Simulated live count
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to fetch dashboard stats");
        
        // Set default values on error
        setStats({
          totalTransactions: 0,
          safeTransactions: 0,
          riskyTransactions: 0,
          fraudPercentage: 0,
          protectedUsers: 0,
          liveTransactionCount: 0,
        });
      }

      setLoading(false);
    });

    // Simulate live transaction count updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        liveTransactionCount: Math.max(0, prev.liveTransactionCount + Math.floor(Math.random() * 10) - 3),
      }));
    }, 3000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  return { stats, loading, error };
}

export function useRecentTransactions(limit: number = 5) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        
        const txs = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Transaction))
          .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
          .slice(0, limit);

        setTransactions(txs);
        setError(null);
      } catch (err) {
        console.error("Error fetching recent transactions:", err);
        setError("Failed to fetch recent transactions");
        setTransactions([]);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [limit]);

  return { transactions, loading, error };
}

export function useRecentAlerts(limit: number = 5) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const alertsRef = collection(db, "alerts");
        const q = query(alertsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        
        const alertData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Alert))
          .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis())
          .slice(0, limit);

        setAlerts(alertData);
        setError(null);
      } catch (err) {
        console.error("Error fetching recent alerts:", err);
        setError("Failed to fetch recent alerts");
        setAlerts([]);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [limit]);

  return { alerts, loading, error };
}
