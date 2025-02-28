import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Flashcard } from "./LanguageLearning";
import CardDisplay from "./CardDisplay";

interface DictionaryResponse {
  word: string;
  phonetic?: string;
  phonetics?: { text: string; audio: string }[];
  meanings?: {
    definitions: { definition: string; example?: string }[];
  }[];
}

interface FlashcardCardProps {
  card: Flashcard;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ card }) => {
  const [dictData, setDictData] = useState<DictionaryResponse | null>(null);

  // دریافت داده‌های دیکشنری برای به‌دست آوردن تلفظ و مثال در صورت عدم وجود در کارت
  useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${card.word}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setDictData(data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [card.word]);

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // دریافت متن تلفظ؛ در صورت موجود نبود از اولین phonetics استفاده می‌کنیم
  const phoneticText =
    dictData?.phonetic ||
    (dictData?.phonetics && dictData.phonetics[0]?.text) ||
    "";

  // استفاده از مثال ذخیره شده در کارت، در غیر این صورت از API استفاده می‌کنیم
  const exampleText =
    card.examples.length > 0
      ? card.examples.join(" | ")
      : dictData &&
        dictData.meanings &&
        dictData.meanings[0]?.definitions[0]?.example
      ? dictData.meanings[0].definitions[0].example
      : "مثالی موجود نیست";

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {card.word}
        </Typography>
        {phoneticText && (
          <Typography variant="subtitle1" color="textSecondary">
            {phoneticText}
          </Typography>
        )}
        <Typography variant="body1">{card.meaning}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          مثال: {exampleText}
        </Typography>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          {dictData?.phonetics &&
            dictData.phonetics.map((p, index) =>
              p.audio ? (
                <Button
                  key={index}
                  variant="contained"
                  size="small"
                  onClick={() => playAudio(p.audio)}
                >
                  پخش {p.text}
                </Button>
              ) : null
            )}
        </div>
        <CardDisplay word={card.word} />
      </CardContent>
    </Card>
  );
};

export default FlashcardCard;
