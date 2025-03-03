import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import CardDisplay from "./CardDisplay";
import { Flashcard } from "./FlashcardList";
import useGetDictData from "./services/useGetDictData";


interface FlashcardCardProps {
  card: Flashcard;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ card }) => {
  const { data } = useGetDictData(card.word);

  // اطمینان از وجود داده‌ها و استخراج اولین عنصر
  const dictionaryData = data && data.length > 0 ? data[0] : null;

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  // دریافت متن تلفظ؛ در صورت موجود نبود از اولین phonetics استفاده می‌کنیم
  const phoneticText =
    dictionaryData?.phonetic ||
    (dictionaryData?.phonetics && dictionaryData.phonetics[0]?.text) ||
    "";

  // استفاده از مثال ذخیره شده در کارت، در غیر این صورت از API استفاده می‌کنیم
  const exampleText =
    card.examples.length > 0
      ? card.examples.join(" | ")
      : dictionaryData &&
        dictionaryData.meanings &&
        dictionaryData.meanings[0]?.definitions[0]?.example
        ? dictionaryData.meanings[0].definitions[0].example
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
          {dictionaryData?.phonetics &&
            dictionaryData.phonetics.map((p, index) =>
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