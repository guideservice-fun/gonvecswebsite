import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({
          items: [...new Set([...state.items, productId])],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      toggleItem: (productId) => {
        const state = get();
        if (state.isInWishlist(productId)) {
          state.removeItem(productId);
        } else {
          state.addItem(productId);
        }
      },
      isInWishlist: (productId) => {
        const state = get();
        return state.items.includes(productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
