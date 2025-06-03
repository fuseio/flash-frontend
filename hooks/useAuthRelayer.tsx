import { AuthRelayContext } from "@/providers/auth-provider";
import { useContext } from "react";

export const useAuthRelay = () => {
  const context = useContext(AuthRelayContext);
  if (!context) {
    throw new Error("useAuthRelay must be used within a AuthRelayProvider");
  }
  return context;
};
