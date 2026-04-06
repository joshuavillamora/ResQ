import React, { createContext, useContext } from "react";

type DrawerContextValue = {
  menuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;

  overlayVisible: boolean;
  setOverlayVisible: (value: boolean) => void;

  selectedDisaster: number | null;
  setSelectedDisaster: (value: number | null) => void;

  latestReport: {
    id?: number;
    editToken?: string;
    disasterLabel: string;
    barangay: string;
    latitude: number;
    longitude: number;
    deliveryMethod: "api" | "sms";
  } | null;
  setLatestReport: (
    value: {
      id?: number;
      editToken?: string;
      disasterLabel: string;
      barangay: string;
      latitude: number;
      longitude: number;
      deliveryMethod: "api" | "sms";
    } | null,
  ) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

type DrawerProviderProps = {
  value: DrawerContextValue;
  children: React.ReactNode;
};

export const DrawerProvider = ({ value, children }: DrawerProviderProps) => {
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
};

const useDrawer = () => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }

  return context;
};

export default useDrawer;
