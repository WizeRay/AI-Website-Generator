// context/SessionContext.jsx
import { createContext, useContext } from "react";
import { authClient } from "../../lib/auth-client"; // adjust path

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { data, isPending, error } = authClient.useSession();

  return (
    <SessionContext.Provider value={{ session: data, isPending, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);