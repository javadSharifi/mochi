import axios from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

// Define the types for the data structure

interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string; // Optional because not all entries have it
  license?: {
    name: string;
    url: string;
  };
}

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string; // Optional because not all entries have it
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface License {
  name: string;
  url: string;
}

interface WordEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

// Type for the response array
type DictionaryApiResponse = WordEntry[];

// Fetch function with type annotations
const fetchDictionaryData = async (
  word: string
): Promise<DictionaryApiResponse> => {
  const { data } = await axios.get<DictionaryApiResponse>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  return data;
};

// Custom hook with type annotations
export default function useGetDictData(
  word: string
): UseQueryResult<DictionaryApiResponse, unknown> {
  return useQuery({
    queryKey: [`getDictData#${word}`],
    queryFn: () => fetchDictionaryData(word),
    enabled: !!word, // فقط وقتی که کارت دارای واژه باشد درخواست داده می‌شود
    staleTime: 1000 * 60 * 60 * 24, // داده‌ها برای یک روز تازه خواهند ماند (24 ساعت)
  });
}
