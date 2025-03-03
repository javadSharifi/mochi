import React, { useState, useEffect, JSX } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import { FaMicrophone } from "react-icons/fa";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { SiDuckduckgo } from "react-icons/si";
import { FaYandexInternational, FaYahoo } from "react-icons/fa6";
import { IoSearchOutline } from "react-icons/io5";

interface SearchEngineData {
  name: string;
  searchUrl: string;
}

const defaultSearchEnginesData: SearchEngineData[] = [
  { name: "Google", searchUrl: "https://www.google.com/search?q=" },
  { name: "Yandex", searchUrl: "https://yandex.com/search/?text=" },
  { name: "Yahoo", searchUrl: "https://search.yahoo.com/search?p=" },
  { name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q=" },
];

const iconsMap: { [key: string]: JSX.Element } = {
  Google: <FcGoogle />,
  Yandex: <FaYandexInternational className="text-yellow-500" />,
  Yahoo: <FaYahoo className="text-purple-500" />,
  DuckDuckGo: <SiDuckduckgo className="text-orange-500" />,
};

const Search: React.FC = () => {
  const [engine, setEngine] = useState<SearchEngineData>(() => {
    // استفاده از localStorage برای ذخیره موتور جستجوی انتخاب‌شده
    const storedEngine = localStorage.getItem("selectedSearchEngine");
    return storedEngine ? JSON.parse(storedEngine) : defaultSearchEnginesData[0];
  });
  const [isRecording, setIsRecording] = useState(false);

  // ذخیره انتخاب موتور جستجو در localStorage
  useEffect(() => {
    localStorage.setItem("selectedSearchEngine", JSON.stringify(engine));
  }, [engine]);

  // برای تشخیص صدا
  const startSpeechRecognition = (setFieldValue: any) => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "fa-IR";
    recognition.interimResults = false;
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setFieldValue("query", spokenText);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="mb-4 relative">
      <Formik
        initialValues={{ query: "" }}
        validationSchema={Yup.object({
          query: Yup.string().required("این فیلد نباید خالی باشد"),
        })}
        onSubmit={(values, { resetForm }) => {
          if (!values.query.trim()) return;
          window.open(
            `${engine.searchUrl}${encodeURIComponent(values.query)}`,
            "_blank"
          );
          resetForm();
        }}
      >
        {({ setFieldValue }) => (
          <Form className="flex gap-2">
            <div>
              <Field
                type="text"
                name="query"
                placeholder="متن جستجو"
                className="input input-bordered"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <IoSearchOutline />
            </button>

            <IconButton onClick={() => startSpeechRecognition(setFieldValue)}>
              <FaMicrophone
                className={isRecording ? "animate-pulse text-green-500" : ""}
              />
            </IconButton>

            <Select
              value={engine.name}
              onChange={(e) => {
                const selectedEngine = defaultSearchEnginesData.find(
                  (eng) => eng.name === e.target.value
                );
                if (selectedEngine) setEngine(selectedEngine);
              }}
              className="border-0"
              displayEmpty
            >
              {defaultSearchEnginesData.map((eng) => (
                <MenuItem key={eng.name} value={eng.name}>
                  {iconsMap[eng.name]}
                </MenuItem>
              ))}
            </Select>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Search;
