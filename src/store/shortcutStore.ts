// src/store/shortcutStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface ShortcutStore {
  shortcuts: Shortcut[];
  addOrUpdateShortcut: (shortcut: Shortcut) => void;
  deleteShortcut: (id: string) => void;
}

export const useShortcutStore = create<ShortcutStore>()(
  persist(
    (set) => ({
      shortcuts: [],
      addOrUpdateShortcut: (shortcut) =>
        set((state) => {
          const exists = state.shortcuts.some((sc) => sc.id === shortcut.id);
          return {
            shortcuts: exists
              ? state.shortcuts.map((sc) =>
                  sc.id === shortcut.id ? shortcut : sc
                )
              : [...state.shortcuts, shortcut],
          };
        }),
      deleteShortcut: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.filter((sc) => sc.id !== id),
        })),
    }),
    {
      name: "shortcut-storage", // Key for localStorage
    }
  )
);
