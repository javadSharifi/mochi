import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Modal, Box } from "@mui/material";
import { getFlashcards, saveFlashcards } from "../utils/localStorage";
import { Flashcard } from "./FlashcardList";

const Quiz: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastQuizTime, setLastQuizTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const allCards = getFlashcards();
    const now = Date.now();
    const lastTime = Number(localStorage.getItem("lastQuizTime")) || 0;
    setLastQuizTime(lastTime);

    // فیلتر کارت‌های آزمون بر اساس الگوریتم مرور زمان‌بندی (spaced repetition)
    const eligibleCards = allCards.filter((card: Flashcard) => {
      if (card.level === 7) return false;
      const interval = getIntervalForLevel(card.level);
      return !card.nextReview || now >= card.nextReview;
    });
    setQuizCards(eligibleCards);

    // محاسبه زمان باقی‌مانده برای آزمون بعدی
    if (now - lastTime < 10800000) {
      setTimeRemaining(10800000 - (now - lastTime));
    }
  }, []);

  const getIntervalForLevel = (level: number) => {
    switch (level) {
      case 4: return 86400000;
      case 5: return 259200000;
      case 6: return 604800000;
      default: return 0;
    }
  };

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
    setIsModalOpen(true);
  };

  const handleAnswer = (isKnown: boolean) => {
    const card = quizCards[currentIndex];
    const updatedCard = { ...card, level: isKnown ? Math.min(card.level + 1, 6) : Math.max(card.level - 1, 1) };
    updatedCard.nextReview = Date.now() + getIntervalForLevel(updatedCard.level);

    const updatedCards = flashcards.map(fc => fc.id === updatedCard.id ? updatedCard : fc);
    saveFlashcards(updatedCards);
    setFlashcards(updatedCards);

    if (currentIndex + 1 < quizCards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsModalOpen(false); // بستن مودال بعد از اتمام کلمات
      localStorage.setItem("lastQuizTime", Date.now().toString());
      setQuizStarted(false);
      setTimeRemaining(10800000);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">آزمون کلمات</h2>
      {!quizStarted ? (
        <div>
          {Date.now() - lastQuizTime < 10800000 ? (
            <Button variant="contained" disabled>
              آزمون بعدی در:
            </Button>
          ) : (
            <Button variant="contained" onClick={handleStartQuiz}>
              شروع آزمون
            </Button>
          )}
        </div>
      ) : null}

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {quizCards.length > 0 ? (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {quizCards[currentIndex].word}
                </Typography>
                {/* <Typography variant="body1">
                  {quizCards[currentIndex].meaning}
                </Typography> */}
                <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
                  <Button variant="contained" color="success" onClick={() => handleAnswer(true)}>
                    بلدم
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleAnswer(false)}>
                    بلد نیستم
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="h6" align="center">
              تبریک! تو امروز دوره کردی.
            </Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Quiz;
