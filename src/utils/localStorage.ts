// src/utils/localStorage.ts
export const getShortcuts = () => {
  const data = localStorage.getItem("shortcuts");
  return data ? JSON.parse(data) : [];
};

export const saveShortcut = (shortcut: any) => {
  const shortcuts = getShortcuts();
  shortcuts.push(shortcut);
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
