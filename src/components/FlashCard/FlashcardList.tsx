import React from "react";
import { Box } from "@mui/material";
import FlashcardCard from "./FlashcardCard";

export interface Flashcard {
  id: string;
  word: string;
  meaning: string;
  examples: string[];
  level: number;
  nextReview?: number; // زمان بعدی مرور (اختیاری)
}

interface FlashcardListProps {
  flashcards: Flashcard[];
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  return (
    <Box sx={{ p: 3 }}>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {flashcards.map((card) => (
          <FlashcardCard key={card.id} card={card} />
        ))}
      </div>
    </Box>
  );
};

export default FlashcardList;
