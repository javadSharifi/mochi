// src/store/flashcardStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Flashcard } from "../components/FlashCard/FlashcardList";

interface FlashcardStore {
  flashcards: Flashcard[];
  lastQuizTime: number; // اضافه کردن lastQuizTime به حالت
  setFlashcards: (flashcards: Flashcard[]) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
  setLastQuizTime: (time: number) => void; // تابع برای به‌روزرسانی lastQuizTime
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set) => ({
      flashcards: [],
      lastQuizTime: 0, // مقدار اولیه برای lastQuizTime
      setFlashcards: (flashcards) => set({ flashcards }),
      addFlashcard: (flashcard) =>
        set((state) => ({
          flashcards: [...state.flashcards, flashcard],
        })),
      updateFlashcard: (updatedFlashcard) =>
        set((state) => ({
          flashcards: state.flashcards.map((fc) =>
            fc.id === updatedFlashcard.id ? updatedFlashcard : fc
          ),
        })),
      setLastQuizTime: (time) => set({ lastQuizTime: time }), // به‌روزرسانی lastQuizTime
    }),
    {
      name: "flashcard-storage", // نام ذخیره‌سازی در localStorage
    }
  )
);
