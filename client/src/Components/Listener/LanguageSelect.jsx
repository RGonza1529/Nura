import { useState } from 'react';

export default function LanguageSelect({ socket, selectedTranslation, setSelectedTranslation, availableTranslations }){
    const [open, setOpen] = useState(false);

    const handleSelect = (lang) => {
    setOpen(false);

    if (selectedTranslation.label !== 'None'){
        socket.emit('stop-listening', selectedTranslation.label);
    }

    setSelectedTranslation(lang);

    if (lang.label !== 'None'){
        socket.emit('start-listening', lang.label);
    }
    };

    return(
        <div className="relative text-center text-sm inline-block">
            {/* Main Button */}
            <button
                className="p-[10px] rounded-full bg-zinc-800 text-xl font-medium relative"
                onClick={() => setOpen((prev) => !prev)}
            >
                <p>{selectedTranslation.value.toUpperCase()}</p>
            </button>
            <p className="text-zinc-400 mt-1">Language</p>

            {/* Dropdown */}
            {open && (
                <ul className="absolute right-0 bottom-[68px] mb-2 bg-neutral-800 border border-zinc-600 rounded-md shadow-lg text-left w-40 max-h-44 overflow-y-auto z-10">
                {availableTranslations.map((lang) => (
                    <li
                    key={lang.value}
                    onClick={() => handleSelect(lang)}
                    className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${
                        selectedTranslation.value === lang.value ? "bg-zinc-700 text-white" : "text-zinc-300"
                    }`}
                    >
                    {lang.label}
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}