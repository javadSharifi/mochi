import React, { useState, useEffect } from "react";
import { getFlashcards, saveFlashcards } from "../utils/localStorage";
import { Button, Modal, TextField, Tabs, Tab, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import FlashcardCard from "./FlashcardCard";

export interface Flashcard {
  id: string;
  word: string;
  meaning: string;
  examples: string[];
  level: number;
  nextReview?: number; // اضافه کردن این ویژگی
}

const LanguageLearning: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setFlashcards(getFlashcards());
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const formik = useFormik({
    initialValues: { word: "", meaning: "", example1: "", example2: "" },
    validationSchema: Yup.object({
      word: Yup.string().required("کلمه الزامی است"),
      meaning: Yup.string().required("معنی الزامی است"),
    }),
    onSubmit: (values) => {
      const newCard: Flashcard = {
        id: Date.now().toString(),
        word: values.word,
        meaning: values.meaning,
        examples: [values.example1, values.example2].filter(Boolean),
        level: 1,
      };
      const updated = [...flashcards, newCard];
      saveFlashcards(updated);
      setFlashcards(updated);
      setTabIndex(0); // پس از افزودن کارت، به تب "همه کارت‌ها" برو
    },
  });

  return (
    <div className="mb-4">
      <h2 className="text-xl mb-2">لایتنر یادگیری زبان</h2>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="همه کارت‌ها" />
        <Tab label="ایجاد کارت جدید" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcards.map((card) => (
            <FlashcardCard key={card.id} card={card} />
          ))}
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div className="mt-4">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <TextField
              label="کلمه"
              name="word"
              value={formik.values.word}
              onChange={formik.handleChange}
              error={formik.touched.word && Boolean(formik.errors.word)}
              helperText={formik.touched.word && formik.errors.word}
            />
            <TextField
              label="معنی"
              name="meaning"
              value={formik.values.meaning}
              onChange={formik.handleChange}
              error={formik.touched.meaning && Boolean(formik.errors.meaning)}
              helperText={formik.touched.meaning && formik.errors.meaning}
            />
            <TextField
              label="مثال ۱ (اختیاری)"
              name="example1"
              value={formik.values.example1}
              onChange={formik.handleChange}
            />
            <TextField
              label="مثال ۲ (اختیاری)"
              name="example2"
              value={formik.values.example2}
              onChange={formik.handleChange}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outlined" onClick={() => setTabIndex(0)}>
                انصراف
              </Button>
              <Button variant="contained" type="submit">
                ذخیره
              </Button>
            </div>
          </form>
        </div>
      </TabPanel>
    </div>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default LanguageLearning;
