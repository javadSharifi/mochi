import React from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

interface FlashcardFormModalProps {
  open: boolean;
  onClose: () => void;
  onAddCard: (newCard: any) => void;
}

const FlashcardFormModal: React.FC<FlashcardFormModalProps> = ({
  open,
  onClose,
  onAddCard,
}) => {
  const formik = useFormik({
    initialValues: { word: "", meaning: "", example1: "", example2: "" },
    validationSchema: Yup.object({
      word: Yup.string().required("کلمه الزامی است"),
      meaning: Yup.string().required("معنی الزامی است"),
    }),
    onSubmit: (values) => {
      const newCard = {
        id: Date.now().toString(),
        word: values.word,
        meaning: values.meaning,
        examples: [values.example1, values.example2].filter(Boolean),
        level: 1,
      };
      onAddCard(newCard);
      onClose();
      formik.resetForm();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
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
        <h3 className="text-lg font-bold mb-4">ایجاد کارت جدید</h3>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          {(["word", "meaning", "example1", "example2"] as const).map(
            (field) => (
              <TextField
                key={field}
                label={
                  field === "word" || field === "meaning"
                    ? field
                    : `مثال ${field.slice(-1)} (اختیاری)`
                }
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                error={formik.touched[field] && Boolean(formik.errors[field])}
                helperText={formik.touched[field] && formik.errors[field]}
              />
            )
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={onClose}>
              انصراف
            </Button>
            <Button variant="contained" type="submit">
              ذخیره
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FlashcardFormModal;
