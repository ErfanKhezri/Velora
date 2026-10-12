import { createContext, useContext, useState, type ReactNode } from "react";
import type { Customer } from "../api";

type AuthState = { customer: Customer | null; admin: boolean };

type AuthContextValue = AuthState & {
  loginCustomer: (customer: Customer) => void;
  logoutCustomer: () => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
};

const KEY = "velora-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

function load(): AuthState {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { customer: null, admin: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load);

  function update(next: AuthState) {
    setState(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  const value: AuthContextValue = {
    ...state,
    loginCustomer: (customer) => update({ ...state, customer }),
    logoutCustomer: () => update({ ...state, customer: null }),
    loginAdmin: () => update({ ...state, admin: true }),
    logoutAdmin: () => update({ ...state, admin: false }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext)!;
}
