"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BeautyOsContextValue = {
  activeId: string;
  setActiveId: (id: string) => void;
};

const BeautyOsContext = createContext<BeautyOsContextValue | null>(null);

export function BeautyOsProvider({
  children,
  defaultId = "pout",
}: {
  children: ReactNode;
  defaultId?: string;
}) {
  const [activeId, setActiveId] = useState(defaultId);

  const value = useMemo(
    () => ({ activeId, setActiveId }),
    [activeId],
  );

  return (
    <BeautyOsContext.Provider value={value}>{children}</BeautyOsContext.Provider>
  );
}

export function useBeautyOs() {
  const ctx = useContext(BeautyOsContext);
  if (!ctx) {
    throw new Error("useBeautyOs must be used within BeautyOsProvider");
  }
  return ctx;
}
