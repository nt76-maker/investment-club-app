
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("ic_progress");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [investorProfile, setInvestorProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("ic_profile");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    try { localStorage.setItem("ic_progress", JSON.stringify(progress)); }
    catch { }
  }, [progress]);

  useEffect(() => {
    try { localStorage.setItem("ic_profile", JSON.stringify(investorProfile)); }
    catch { }
  }, [investorProfile]);

  const completeModule = (moduleId) => {
    setProgress(prev => ({ ...prev, [moduleId]: true }));
  };

  const isCompleted = (moduleId) => !!progress[moduleId];

  const resetProgress = () => {
    setProgress({});
    setInvestorProfile(null);
    try {
      localStorage.removeItem("ic_progress");
      localStorage.removeItem("ic_profile");
    } catch { }
  };

  return (
    <UserContext.Provider value={{
      progress,
      investorProfile,
      setInvestorProfile,
      completeModule,
      isCompleted,
      resetProgress,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};