// src/App.tsx
import React from "react";

import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import Search from "./components/Search";
import Shortcuts from "./components/shortcuts/Shortcuts";
import LanguageLearning from "./components/FlashCard/LanguageLearning";
import Quiz from "./components/FlashCard/Quiz";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>

        <div data-theme="light" className="min-h-screen bg-gray-100 p-4">
          <Search />
          <Shortcuts />
          <LanguageLearning />
          <Quiz />
        </div>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;
