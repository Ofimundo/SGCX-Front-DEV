import { create } from "zustand";

export const useStoreFacturas = create((set) => ({
  facturasArray: [],
  setFacturasArray: (nuevoArray) => set({ facturasArray: nuevoArray }),
}));

export const useStoreRecargar = create((set) => ({
  isRecargarFacturas: false,
  setRecargarFacturas: () =>
    set((state) => ({ isRecargarFacturas: !state.isRecargarFacturas })),
}));

export default useStoreFacturas;
useStoreRecargar;
