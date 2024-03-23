// LogoutHook.js
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async (storeduserName, setLogoutSuccess) => {
    setIsLoggingOut(true);

    try {
      const response = await fetch(
        "https://spiritual-anglerfish-sodbridge.koyeb.app/api/logout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: storeduserName }),
        }
      );

      if (response.ok) {
        localStorage.removeItem("username");
        message.success("logout successful")
        navigate("/");
        setLogoutSuccess(true);
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

export default useLogout;
