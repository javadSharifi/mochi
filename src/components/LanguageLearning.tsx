import React, { useState, useEffect } from "react";
import { getFlashcards, saveFlashcards } from "../utils/localStorage";
import { Button, Tabs, Tab } from "@mui/material";
import FlashcardFormModal from "./FlashcardFormModal";
import FlashcardList, { Flashcard } from "./FlashcardList";

// ... (تعریف interface Flashcard بدون تغییر)

const LanguageLearning: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setFlashcards(getFlashcards()), []);

  const handleAddCard = (newCard: Flashcard) => {
    const updated = [...flashcards, newCard];
    saveFlashcards(updated);
    setFlashcards(updated);
  };

  // فیلتر کردن کارت‌ها بر اساس تب انتخاب شده
  const filteredCards = () => {
    if (tabIndex === 0) return flashcards; // تب همه
    return flashcards.filter((card) => card.level === tabIndex);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">لایتنر یادگیری زبان</h2>
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        centered
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="همه کارت‌ها" />
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <Tab key={level} label={`سطح ${level}`} />
        ))}
      </Tabs>

      {/* دکمه ایجاد کارت جدید بدون تغییر */}
      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        className="mt-4"
      >
        ایجاد کارت جدید
      </Button>

      {/* مودال بدون تغییر */}
      <FlashcardFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCard={handleAddCard}
      />

      {/* ارسال کارت‌های فیلتر شده به لیست */}
      <FlashcardList flashcards={filteredCards()} />
    </div>
  );
};

export default LanguageLearning;
