import { useState } from "react";

const languages = [
  { label: "Afrikaans", value: "af" },
  { label: "Arabic", value: "ar" },
  { label: "Armenian", value: "hy" },
  { label: "Azerbaijani", value: "az" },
  { label: "Belarusian", value: "be" },
  { label: "Bosnian", value: "bs" },
  { label: "Bulgarian", value: "bg" },
  { label: "Catalan", value: "ca" },
  { label: "Chinese", value: "zh" },
  { label: "Croatian", value: "hr" },
  { label: "Czech", value: "cs" },
  { label: "Danish", value: "da" },
  { label: "Dutch", value: "nl" },
  { label: "English", value: "en" },
  { label: "Estonian", value: "et" },
  { label: "Finnish", value: "fi" },
  { label: "French", value: "fr" },
  { label: "Galician", value: "gl" },
  { label: "German", value: "de" },
  { label: "Greek", value: "el" },
  { label: "Hebrew", value: "he" },
  { label: "Hindi", value: "hi" },
  { label: "Hungarian", value: "hu" },
  { label: "Icelandic", value: "is" },
  { label: "Indonesian", value: "id" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "ja" },
  { label: "Kannada", value: "kn" },
  { label: "Kazakh", value: "kk" },
  { label: "Korean", value: "ko" },
  { label: "Latvian", value: "lv" },
  { label: "Lithuanian", value: "lt" },
  { label: "Macedonian", value: "mk" },
  { label: "Malay", value: "ms" },
  { label: "Marathi", value: "mr" },
  { label: "Maori", value: "mi" },
  { label: "Nepali", value: "ne" },
  { label: "Norwegian", value: "no" },
  { label: "Persian", value: "fa" },
  { label: "Polish", value: "pl" },
  { label: "Portuguese", value: "pt" },
  { label: "Romanian", value: "ro" },
  { label: "Russian", value: "ru" },
  { label: "Serbian", value: "sr" },
  { label: "Slovak", value: "sk" },
  { label: "Slovenian", value: "sl" },
  { label: "Spanish", value: "es" },
  { label: "Swahili", value: "sw" },
  { label: "Swedish", value: "sv" },
  { label: "Tagalog", value: "tl" },
  { label: "Tamil", value: "ta" },
  { label: "Thai", value: "th" },
  { label: "Turkish", value: "tr" },
  { label: "Ukrainian", value: "uk" },
  { label: "Urdu", value: "ur" },
  { label: "Vietnamese", value: "vi" },
  { label: "Welsh", value: "cy" },
];

export default function SelectTranslation({ selectedLanguages, setSelectedLanguages, invalidForm }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.label.toLowerCase().includes(input.toLowerCase()) &&
      !selectedLanguages.find((s) => s.value === lang.value)
  );

  const addLanguage = (lang) => {
    setSelectedLanguages([...selectedLanguages, lang]);
    setInput("");
    setShowSuggestions(false);
  };

  const removeLanguage = (langValue) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l.value !== langValue));
  };

  return (
    <div className="w-full pb-6 relative">
      <label className="font-semibold mb-0 text-zinc-400 block">
        Translation
      </label>

      <div className={`flex flex-wrap items-center gap-2 bg-neutral-800 rounded-md p-2 min-h-[42px] ${(invalidForm && selectedLanguages.length === 0) ? 'outline outline-red-500' : 'outline outline-zinc-400'}`}>
        {selectedLanguages.map((lang) => (
          <div
            key={lang.value}
            className="flex items-center bg-indigo-500/50 hover:bg-indigo-500/70 transition-colors duration-150 outline-2 outline-indigo-600 text-white px-3 py-1 rounded-md text-sm"
          >
            {lang.label}
            <button
              onClick={() => removeLanguage(lang.value)}
              className="ml-2 text-white hover:text-pink-600 transition-colors duration-150"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="relative flex-1 min-w-[120px]">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={"Type a language..."}
            className="bg-transparent text-white outline-none w-full placeholder-zinc-500"
          />

          {showSuggestions && filteredLanguages.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 overflow-y-auto bg-neutral-800 border border-zinc-600 rounded-md w-full shadow-lg">
              {filteredLanguages.map((lang) => (
                <li
                  key={lang.value}
                  onClick={() => addLanguage(lang)}
                  className="px-3 py-2 hover:bg-zinc-700 cursor-pointer text-white"
                >
                  {lang.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(invalidForm && selectedLanguages.length === 0) && <span className="absolute bottom-0 left-0 text-red-500">Select 1 or more translations</span>}
    </div>
  );
}
