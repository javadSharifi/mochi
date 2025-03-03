import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Modal, Box } from "@mui/material";
import { Flashcard } from "./FlashcardList";
import { useFlashcardStore } from "../../store/flashcardStore";



// تعریف تابع getIntervalForLevel خارج از کامپوننت
const getIntervalForLevel = (level: number): number => {
  switch (level) {
    case 4:
      return 86400000; // 1 روز
    case 5:
      return 259200000; // 3 روز
    case 6:
      return 604800000; // 7 روز
    default:
      return 0;
  }
};

const Quiz: React.FC = () => {
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // استخراج lastQuizTime و setLastQuizTime از zustand
  const { flashcards, lastQuizTime, setFlashcards, setLastQuizTime } =
    useFlashcardStore();

  useEffect(() => {
    const now = Date.now();

    // فیلتر کارت‌های آزمون بر اساس الگوریتم مرور زمان‌بندی (spaced repetition)
    const eligibleCards = flashcards.filter((card: Flashcard) => {
      if (card.level === 7) return false;
      const interval = getIntervalForLevel(card.level); // استفاده از تابع
      return !card.nextReview || now >= card.nextReview;
    });
    setQuizCards(eligibleCards);

    // محاسبه زمان باقی‌مانده برای آزمون بعدی
    if (now - lastQuizTime < 10800000) {
      setTimeRemaining(10800000 - (now - lastQuizTime));
    }
  }, [flashcards, lastQuizTime]);

  const handleStartQuiz = () => {
    if (Date.now() - lastQuizTime < 10800000) return; // اگر زمان آزمون هنوز نرسیده است
    if (quizCards.length === 0) return;

    setQuizStarted(true);
    setIsModalOpen(true);
  };

  const handleAnswer = (isKnown: boolean) => {
    const card = quizCards[currentIndex];
    const updatedCard = {
      ...card,
      level: isKnown ? Math.min(card.level + 1, 6) : Math.max(card.level - 1, 1),
    };
    updatedCard.nextReview = Date.now() + getIntervalForLevel(updatedCard.level); // استفاده از تابع

    const updatedCards = flashcards.map((fc) =>
      fc.id === updatedCard.id ? updatedCard : fc
    );
    setFlashcards(updatedCards);

    if (currentIndex + 1 < quizCards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsModalOpen(false); // بستن مودال بعد از اتمام کلمات
      setLastQuizTime(Date.now()); // به‌روزرسانی lastQuizTime در zustand
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