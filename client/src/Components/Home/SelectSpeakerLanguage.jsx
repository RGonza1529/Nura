
export default function SelectSpeakerLanguage({speakerLanguage, setSpeakerLanguage, invalidForm}){

    const handleOnChange = (e) => {
        setSpeakerLanguage(e.target.value);
    }

    return(
        <div className="relative pb-6">
            <label className="font-semibold mb-0 text-zinc-400 block">
                Speaker language
            </label>

            <div className={`w-full bg-neutral-800 p-2 rounded-md ${(invalidForm && speakerLanguage === "none") ? 'outline outline-red-500' : 'outline outline-zinc-400'}`}>
                <select
                className="w-full bg-neutral-800 text-white outline-none border-none rounded-md cursor-pointer"
                defaultValue="none"
                onChange={handleOnChange} 
                >
                <option value="none">Select Language</option>
                <option value="">Auto detect (WARNING: longer processing)</option>
                <option value="af">Afrikaans</option>
                <option value="ar">Arabic</option>
                <option value="hy">Armenian</option>
                <option value="az">Azerbaijani</option>
                <option value="be">Belarusian</option>
                <option value="bs">Bosnian</option>
                <option value="bg">Bulgarian</option>
                <option value="ca">Catalan</option>
                <option value="zh">Chinese</option>
                <option value="hr">Croatian</option>
                <option value="cs">Czech</option>
                <option value="da">Danish</option>
                <option value="nl">Dutch</option>
                <option value="en">English</option>
                <option value="et">Estonian</option>
                <option value="fi">Finnish</option>
                <option value="fr">French</option>
                <option value="gl">Galician</option>
                <option value="de">German</option>
                <option value="el">Greek</option>
                <option value="he">Hebrew</option>
                <option value="hi">Hindi</option>
                <option value="hu">Hungarian</option>
                <option value="is">Icelandic</option>
                <option value="id">Indonesian</option>
                <option value="it">Italian</option>
                <option value="ja">Japanese</option>
                <option value="kn">Kannada</option>
                <option value="kk">Kazakh</option>
                <option value="ko">Korean</option>
                <option value="lv">Latvian</option>
                <option value="lt">Lithuanian</option>
                <option value="mk">Macedonian</option>
                <option value="ms">Malay</option>
                <option value="mr">Marathi</option>
                <option value="mi">Maori</option>
                <option value="ne">Nepali</option>
                <option value="no">Norwegian</option>
                <option value="fa">Persian</option>
                <option value="pl">Polish</option>
                <option value="pt">Portuguese</option>
                <option value="ro">Romanian</option>
                <option value="ru">Russian</option>
                <option value="sr">Serbian</option>
                <option value="sk">Slovak</option>
                <option value="sl">Slovenian</option>
                <option value="es">Spanish</option>
                <option value="sw">Swahili</option>
                <option value="sv">Swedish</option>
                <option value="tl">Tagalog</option>
                <option value="ta">Tamil</option>
                <option value="th">Thai</option>
                <option value="tr">Turkish</option>
                <option value="uk">Ukrainian</option>
                <option value="ur">Urdu</option>
                <option value="vi">Vietnamese</option>
                <option value="cy">Welsh</option>
                </select>
            </div>

            {(invalidForm && speakerLanguage === "none") && <span className="absolute bottom-0 left-0 text-red-500">Select a language</span>}
        </div>
    )
}