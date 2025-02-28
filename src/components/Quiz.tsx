import React, { useState, useEffect } from "react";
import { getFlashcards, saveFlashcards } from "../utils/localStorage";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Flashcard } from "./LanguageLearning";

const Quiz: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastQuizTime, setLastQuizTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const allCards = getFlashcards();
    setFlashcards(allCards);
    const now = Date.now();
    const lastTime = Number(localStorage.getItem("lastQuizTime")) || 0;
    setLastQuizTime(lastTime);

    // فیلتر کارت‌های آزمون بر اساس الگوریتم مرور زمان‌بندی (spaced repetition)
    const eligibleCards = allCards.filter((card: Flashcard) => {
      if (card.level === 7) return false;
      const interval =
        card.level === 4
          ? 86400000
          : card.level === 5
          ? 259200000
          : card.level === 6
          ? 604800000
          : 0;
      return !card.nextReview || now >= card.nextReview;
    });
    setQuizCards(eligibleCards);

    // در صورتی که بازه ۳ ساعته تکمیل نشده باشد، زمان باقی‌مانده محاسبه می‌شود
    if (now - lastTime < 10800000) {
      setTimeRemaining(10800000 - (now - lastTime));
    }
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h}ساعت ${m}دقیقه ${s}ثانیه`;
  };

  const handleStartQuiz = () => {
    if (Date.now() - lastQuizTime < 10800000) return; // اگر زمان آزمون هنوز نرسیده است
    if (quizCards.length === 0) return;
    setQuizStarted(true);
  };

  const handleAnswer = (isKnown: boolean) => {
    const card = quizCards[currentIndex];
    if (isKnown && card.level < 6) {
      card.level += 1;
    } else if (!isKnown && card.level > 1) {
      card.level -= 1;
    }
    const interval =
      card.level === 4
        ? 86400000
        : card.level === 5
        ? 259200000
        : card.level === 6
        ? 604800000
        : 0;
    card.nextReview = Date.now() + interval;
    const updatedCards = flashcards.map((fc: Flashcard) =>
      fc.id === card.id ? card : fc
    );
    saveFlashcards(updatedCards);
    setFlashcards(updatedCards);
    setCurrentIndex((prev) => (prev + 1) % quizCards.length);
    localStorage.setItem("lastQuizTime", Date.now().toString());
    setQuizStarted(false);
    setTimeRemaining(10800000);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">آزمون کلمات</h2>
      {!quizStarted ? (
        <div>
          {Date.now() - lastQuizTime < 10800000 ? (
            <Button variant="contained" disabled>
              آزمون بعدی در: {formatTime(timeRemaining)}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleStartQuiz}>
              شروع آزمون
            </Button>
          )}
        </div>
      ) : quizCards.length > 0 ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {quizCards[currentIndex].word}
            </Typography>
            <Typography variant="body1">
              {quizCards[currentIndex].meaning}
            </Typography>
            <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleAnswer(true)}
              >
                بلدم
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleAnswer(false)}
              >
                بلد نیستم
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1">
          کارت‌های آماده آزمون وجود ندارد.
        </Typography>
      )}
    </div>
  );
};

export default Quiz;
