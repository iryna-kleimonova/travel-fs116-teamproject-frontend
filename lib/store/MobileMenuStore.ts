import { create } from 'zustand';

type MobileMenuOpen = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: () => void;
  closeMobileMenu: () => void;
};

export const useMobileMenuOpen = create<MobileMenuOpen>((set, get) => ({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () =>
    set(() => ({ isMobileMenuOpen: !get().isMobileMenuOpen })),
  closeMobileMenu: () => set(() => ({ isMobileMenuOpen: false })),
}));

