// src/components/ModalForm.tsx
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Button, TextField } from "@mui/material";
import { Shortcut } from "./Shortcuts";
import { useShortcutStore } from "../../store/shortcutStore";
import { BiWorld } from "react-icons/bi";

interface ModalFormProps {
  onClose: () => void;
  initialValues: Shortcut | null; // اضافه کردن props برای دریافت میانبر ویرایش شده
}

const ModalForm: React.FC<ModalFormProps> = ({ onClose, initialValues }) => {
  const { addOrUpdateShortcut } = useShortcutStore();
  const [iconUrl, setIconUrl] = useState<string>();

  // تابع برای استخراج نام دامنه از URL
  const extractDomainName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      // حذف www و پسوندهای اضافی دامنه
      const domainParts = hostname.split('.');
      if (domainParts.length > 2) {
        domainParts.shift(); // حذف www اگر وجود داشته باشد
      }
      return domainParts.slice(0, -1).join('.'); // حذف پسوند دامنه (مثلاً .ir یا .com)
    } catch (error) {
      console.error("Invalid URL", error);
      return "";
    }
  };

  const extractIcon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch (error) {
      console.error("Invalid URL", error);
      return "";
    }
  };

  const formik = useFormik({
    initialValues: initialValues || { name: "", url: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("نام الزامی است"),
      url: Yup.string().url("آدرس معتبر نیست").required("آدرس الزامی است"),
    }),
    onSubmit: (values) => {
      const icon = extractIcon(values.url);
      const domainName = extractDomainName(values.url); // استخراج نام دامنه

      const shortcutToSave = {
        id: initialValues ? initialValues.id : Date.now().toString(),
        name: domainName, // استفاده از نام دامنه به عنوان نام
        url: values.url,
        icon,
      };

      // اگر initialValues وجود داشته باشد، میانبر را ویرایش می‌کنیم
      addOrUpdateShortcut(shortcutToSave);
      onClose();
    },
  });

  // استفاده از useEffect برای بروزرسانی نام در فیلد formik در هنگام تغییر URL
  useEffect(() => {
    if (formik.values.url) {
      const domainName = extractDomainName(formik.values.url);
      // فقط اگر نام تغییر کرده باشد، فیلد name را به‌روز می‌کنیم
      if (formik.values.name !== domainName) {
        formik.setFieldValue("name", domainName);
      }
      const icon = extractIcon(formik.values.url);
      setIconUrl(icon); // ذخیره آیکن در state برای نمایش
    }
  }, [formik.values.url, formik.setFieldValue]);

  return (
    <Modal open={true} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg w-80">
        <h3 className="text-lg mb-4">
          {initialValues ? "ویرایش میانبر" : "افزودن میانبر"}
        </h3>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
          <div className="size-24 border-2 border-neutral-content	 p-1 rounded-2xl self-center ">
            {iconUrl ? <img src={iconUrl} alt="Icon" className="rounded-2xl w-full h-full" />
              : <BiWorld className=" w-full h-full " />}
          </div>
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
