// src/components/ModalForm.tsx
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button, TextField } from "@mui/material";
import { saveShortcut } from "../utils/localStorage";
import { Shortcut } from "./Shortcuts";

interface ModalFormProps {
  onClose: () => void;
  initialValues: Shortcut | null; // اضافه کردن props برای دریافت میانبر ویرایش شده
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues || { name: "", url: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("نام الزامی است"),
      url: Yup.string().url("آدرس معتبر نیست").required("آدرس الزامی است"),
    }),
    onSubmit: (values) => {
      const icon = extractIcon(values.url);

      const shortcutToSave = {
        id: initialValues ? initialValues.id : Date.now().toString(),
        ...values,
        icon,
      };

      // اگر initialValues وجود داشته باشد، میانبر را ویرایش می‌کنیم
      saveShortcut(shortcutToSave);
      onClose();
    },
  });

  const extractIcon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch (error) {
      console.error("Invalid URL", error);
      return "";
    }
  };
  return (
    <Modal open={true} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg w-80">
        <h3 className="text-lg mb-4">
          {initialValues ? "ویرایش میانبر" : "افزودن میانبر"}
        </h3>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <TextField
            label="نام"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            label="آدرس"
            name="url"
            value={formik.values.url}
            onChange={formik.handleChange}
            error={formik.touched.url && Boolean(formik.errors.url)}
            helperText={formik.touched.url && formik.errors.url}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outlined" onClick={onClose}>
              لغو
            </Button>
            <Button variant="contained" type="submit">
              ذخیره
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalForm;
