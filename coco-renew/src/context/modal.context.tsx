import { MenuItem } from "../types";
import React, { createContext } from "react";

export interface ExtrasModalContext {
  chosenItem: MenuItem | undefined;
  setOpen: (chosenItem: MenuItem | undefined) => void;
}

const ModalContext = createContext<ExtrasModalContext | null>(null);

export function ExtrasModalContextProvider(props: { children: React.ReactNode }) {
  const [chosenItem, setOpen] = React.useState<MenuItem | undefined>(undefined);
  

  return (
    <ModalContext.Provider value={{ chosenItem, setOpen }}>{props.children}</ModalContext.Provider>
  );
}

export function useExtrasModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("useExtrasModalContext must be used within a ExtrasModalContextProvider");
  }
  return context;
}
