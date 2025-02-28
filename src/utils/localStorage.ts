import { Shortcut } from "../components/Shortcuts";

// src/utils/localStorage.ts
export const getShortcuts = () => {
  const data = localStorage.getItem("shortcuts");
  return data ? JSON.parse(data) : [];
};

export const saveShortcut = (shortcut: Shortcut) => {
  const shortcuts = getShortcuts();

  // بررسی وجود میانبر با همین id و جایگزینی آن با اطلاعات جدید
  const index = shortcuts.findIndex(
    (item: Shortcut) => item.id === shortcut.id
  );
  if (index !== -1) {
    shortcuts[index] = shortcut; // به‌روزرسانی میانبر
  } else {
    shortcuts.push(shortcut); // اگر میانبر وجود نداشت، میانبر جدید اضافه شود
  }

  localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
};

export const removeShortcut = (id: string) => {
  const shortcuts = getShortcuts().filter((item: any) => item.id !== id);
  localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
};

export const getFlashcards = () => {
  const data = localStorage.getItem("flashcards");
  return data ? JSON.parse(data) : [];
};

export const saveFlashcards = (flashcards: any) => {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
};
