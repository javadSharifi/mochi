// src/App.tsx
import React from "react";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Search from "./components/Search";
import Shortcuts from "./components/Shortcuts";
import LanguageLearning from "./components/LanguageLearning";
import Quiz from "./components/Quiz";

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <div data-theme="light" className="min-h-screen bg-gray-100 p-4">
        <Search />
        <Shortcuts />
        <LanguageLearning />
        <Quiz />
      </div>
    </I18nextProvider>
  );
};

export default App;
