import { useState, useEffect } from "react";

const useProfileCheck = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user data for frontend-only mode
    const mockUser = {
      username: "Santanu",
      fullName: "Santanu Halder",
      phone: "6289934194",
    };

    setUser(mockUser);
    setIsProfileComplete(true);
    setLoading(false);

    // Optional delay for realism
    // setTimeout(() => {
    //   setUser(mockUser);
    //   setIsProfileComplete(true);
    //   setLoading(false);
    // }, 500);
  }, []);

  return { isProfileComplete, user, loading };
};

export default useProfileCheck;


