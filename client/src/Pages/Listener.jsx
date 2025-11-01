import { useRef, useEffect, useState } from 'react';
import socket from '../Websocket/socket';

// COMPONENTS
import LanguageSelect from '../Components/Listener/LanguageSelect';

// ASSETS
import headphones from '../assets/icons/Headphones.svg';

export default function Listener(){

    const [toggleListen, setToggleListen] = useState(false);
    const [liveCaptions, setLiveCaptions] = useState([]);
    const activeRef = useRef(null);

    const [selectedTranslation, setSelectedTranslation] = useState({ label: "None", value: "NN" });
    const [availableTranslations, setAvailableTranslations] = useState([{ label: "None", value: "NN" }]);

    // variables for text-to-speech queue system
    const queue = useRef([]);
    const audioRef = useRef(new Audio());
    const isPlaying = useRef(false);

    // basically, a function that listens for 
    // updates from the backend
    useEffect(() => {

        socket.on(`translation-results:${selectedTranslation.label}`, (data) => {
            // process audio and push data into queue
            const audioBlob = new Blob([data.audio], { type: "audio/wav" });
            queue.current.push({text: data.text, audio: audioBlob});

            // conditional statement for adding new 
            // captions onto the screen only under 
            // certain conditions.
            if (toggleListen){
                if (isPlaying.current === false){
                    addCaption();
                }
            }
            else{
                addCaption();
            }
        });

        socket.on('available-translations', (data) => {
            setAvailableTranslations([{ label: "None", value: "NN" }, ...data.translations]);
            setSelectedTranslation({ label: "None", value: "NN" })
        })

        return () => {
            socket.off(`translation-results:${selectedTranslation.label}`);
            socket.off('available-translations')
        };
    }, [socket, toggleListen, selectedTranslation]);

    // updates the UI when new captions arrive
    // also handles playing TTS
    useEffect(() => {

        if (selectedTranslation.label === 'None'){
            return;
        }

        // keeps the active index of liveCaptions on the screen
        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth" });
        }

        // conditional statement for playing audio
        if (toggleListen && liveCaptions.length > 0){
            let audioBlob = liveCaptions[liveCaptions.length-1].audio;
            const url = URL.createObjectURL(audioBlob);
            isPlaying.current = true;

            audioRef.current.src = url;
            audioRef.current.play().catch(err => {
                console.error("Playback failed:", err);
                isPlaying.current = false;
            });

            // adds new caption when the current audio ends
            audioRef.current.onended = addCaption;

            // Cleanup on unmount
            return () => {
                audioRef.current.onended = null;
                URL.revokeObjectURL(url);
            };
        }
    }, [liveCaptions, toggleListen]);

    useEffect(() => {
        // Clean up on disconnect or page leave
        return () => {
            if (selectedTranslation.label !== 'None'){
                socket.emit("stop-listening", selectedTranslation.label);
            }
        };
    }, [selectedTranslation]);

    // helper function to add queued caption
    const addCaption = () => {
        if (queue.current.length === 0){
            isPlaying.current = false;
            return;
        }

        const captionInfo = queue.current.shift();
        setLiveCaptions(prev => [...prev, { text: captionInfo.text, audio: captionInfo.audio }]);
    }

    // UI test
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setLiveCaptions(prev => [
    //         ...prev,
    //         { text: `This is caption ${prev.length + 1}` },
    //         ]);
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);

    const handleListen = () => {
        if (toggleListen){
            // pause audio immediately when 
            // user disables text-to-speech
            setToggleListen(false);
            audioRef.current.pause();
        }
        else{
            setToggleListen(true);
        }
    }

    return(
        <main className="h-[100dvh] max-h-[100dvh] bg-neutral-950 flex justify-center p-6 lg:pb-36">
            <div className="flex flex-col gap-2 h-full w-full items-center max-w-4xl">

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3">Live Captions</h1>
                <section className="h-full w-full relative overflow-hidden">
                    <div className="h-full w-full flex flex-col gap-16 items-center py-10 overflow-y-auto scrollbar-hide overflow-x-hidden">
                        {liveCaptions.length > 0 ? 
                        <>
                        {liveCaptions.map((caption, index) => {
                            const isActive = index === liveCaptions.length - 1;
                            return (
                                    <p
                                        key={index}
                                        ref={isActive ? activeRef : null}
                                        className={` w-full ${isActive ? "text-white scale-110 sm:scale-100" : "text-zinc-500"} text-3xl sm:text-4xl md:text-5xl font-medium px-5 transition-all duration-200 ease-in-out`}
                                        >{caption.text}</p>
                            )
                            })}
                        </>
                        :
                        <>
                        <p className="max-w-[220px] my-auto mx-auto text-center text-zinc-400">The captions will appear here</p>
                        </>
                        }
                    </div>


                    {/* top fade */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-neutral-950 to-transparent z-10"></div>

                    {/* bottom fade */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-neutral-950 to-transparent z-10"></div>
                </section>

                <div className="w-full max-w-xl flex items-center justify-between px-5">

                    <div className="text-center text-sm">
                        <button 
                            className={`p-[10px] rounded-full ${toggleListen ? "bg-indigo-400" : "bg-zinc-800"} mb-1 transition-colors duration-100 z-10 relative`}
                            title="Listen to captions"
                            aria-label="Click to listen to captions"
                            onClick={handleListen}
                        >
                            <img src={headphones} alt="" className="w-8 h-8 "/>

                            {toggleListen && <span className="absolute inline-flex animate-ping bg-indigo-400 opacity-75 top-0 left-0 h-full w-full rounded-full z-0"></span>}
                        </button>
                        <p>Listen</p>
                    </div>

                    {/* <div className="text-center text-sm">
                        <button 
                            className="p-[10px] rounded-full bg-zinc-800 text-xl font-medium"
                            onClick={null}
                        >
                            <p>EN</p>
                        </button>
                        <p className="">Language</p>
                    </div> */}

                    <LanguageSelect
                        socket={socket}
                        selectedTranslation={selectedTranslation}
                        setSelectedTranslation={setSelectedTranslation}
                        availableTranslations={availableTranslations}
                    />

                </div>
            </div>
        </main>
    )
}