import { useState, useRef, useEffect } from 'react';
import socket from '../../Websocket/socket'

// COMPONENTS
import Captions from '../../Components/Home/Captions';
import SelectSpeakerLanguage from './SelectSpeakerLanguage';
import SelectTranslation from './SelectTranslation';

// ASSETS
import start from '../../assets/icons/Play.svg';
import stop from '../../assets/icons/stop_Circle.svg';
import Grid from '../../assets/icons/Grid.svg';
import Headphones from '../../assets/icons/Headphones.svg';

export default function Host({ captionsBarOpen, toggleCaptions, windowWidth }){

    // front end variables
    const [showSettings, setShowSettings] = useState(false);
    const [liveCaptions, setLiveCaptions] = useState("");
    const [recording, setRecording] = useState(false);

    // audio-rated variables
    const mediaRecorderRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const [audioPermission, setAudioPermission] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");

    // form input variables
    const [speakerLanguage, setSpeakerLanguage] = useState("none");
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [invalidForm, setInvalidForm] = useState(false);

    useEffect(() => {
        getAudioPermission();
    }, []);

    // listening for transcript results
    useEffect(() => {
        // receive English transcript from backend
        socket.on("transcription:result", (data) => {
            // console.log("received ");
            setLiveCaptions(prevText => prevText + " " + data.text);
        });

        return () => {
            socket.off('transcription:result');
        };
    
    }, [socket]);

    const getAudioPermission = async () => {
        try {
            // Ask for permission to access the mic
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioPermission(true);

            const allDevices = await navigator.mediaDevices.enumerateDevices();
            const audioInputs = allDevices.filter(
            (device) => device.kind === "audioinput"
            );
            setDevices(audioInputs);

            if (audioInputs.length > 0) {
            setSelectedDeviceId(audioInputs[0].deviceId);
            }
        } catch (err) {
            console.error("Error accessing audio devices:", err);
        }
    }

    // transcription works for the most part, 
    // but misses words every so often.
    const startRecording = async () => {

        if (!socket?.connected){
            alert("Failed to connect to Websocket");
            return;
        }

        // input validation
        if (speakerLanguage === "none" || selectedLanguages.length === 0){
            console.log("incomplete form")
            setInvalidForm(true);
            return;
        }

        setInvalidForm(false);

        // console.log("speakerLanguage: ", speakerLanguage);
        // return;

        try{

            const languageData = {
                speakerLanguage: speakerLanguage,
                selectedLanguages: selectedLanguages
            }

            // console.log(languageData);

            socket.emit('language:data', languageData);

            console.log("recording started");

            // return;
            
            // immediately start the first recording
            startNewRecording();

            // every 7 seconds the recorder will stop recording,
            // which will send a 7-second audio chunk to the backend,
            // and a new recording will immediately start
            recordingIntervalRef.current = setInterval(() => {

                if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                    mediaRecorderRef.current.stop(); // stop recording and trigger ondataavailable
                }
                startNewRecording(); // start new recording

            }, 7000);

        }
        catch(err){
            console.error(err);
            socket.disconnect();
            console.log("socket connection closed");
        }
    }

    const startNewRecording = async () => {

        // create new media stream and recorder for each audio chunk
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, {mimeType: 'audio/webm;codecs=opus'});

        mediaRecorderRef.current.onstart = () => {
            setRecording(true);
        }

        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0){
                socket.emit("transcribe:audio", event.data);
                console.log("sent audio chunk");
            }
        }

        mediaRecorderRef.current.onerror = (event) => {
            console.error("MediaRecorder error:", event.error);
        };

        mediaRecorderRef.current.start();
    };


  const stopRecording = () => {

    // clear interval
    if (recordingIntervalRef.current){
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
    }

    mediaRecorderRef.current.stop();

    // clean up
    mediaRecorderRef.current.onstop = () => {

        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current = null;

        setRecording(false);
        console.log("stopped recording");
    }
  };

    return(
        <section className={`fixed top-0 right-0 z-30 w-full h-full flex flex-col py-2 px-2 sm:px-5 gap-2 bg-zinc-950 transform transition-transform duration-100 lg:border-l-[1px] border-zinc-600
          ${captionsBarOpen ? 'translate-x-0' : 'translate-x-full'} lg:static lg:translate-x-0 lg:w-1/3 lg:min-w-[300px] lg:max-w-sm`}
        >
            <div className="flex flex-col w-full">

                <div className="flex justify-between w-full mb-2">

                        {windowWidth < 1024 && 
                        <button 
                            onClick={() => toggleCaptions(false)}
                            className="flex items-center gap-1"
                            title="Go back to dahboard"
                            aria-label="Go back to dahboard"
                        >
                            <img src={Grid} alt="" className="w-6 h-6"/>

                            <p className="text-zinc-400"
                            >Back to dashboard</p>
                        </button>
                        }

                    {windowWidth < 1024 && 
                        <button 
                            title="show audio settings"
                            aria-label="show audio settings"
                            onClick={() => setShowSettings(!showSettings)}
                            className="bg-[#1c1c21] py-1 px-3 border-1 border-zinc-500 rounded-lg text-sm font-medium ml-auto"
                        >
                            {showSettings ? "Close settings" : "Show settings"}</button>
                    }

                </div>

                {((showSettings || windowWidth >= 1024) && audioPermission) &&
                    <form className=" flex flex-col">

                        <div className="mb-3">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Caption controls</h2>
                            <p className="text-zinc-400">Get set up to live stream captions</p>
                        </div>

                        {/* input device stuff */}
                        <div className="mb-3">
                            <label className="font-semibold mb-4 text-zinc-400">Input device</label>
                            <select
                                className="w-full bg-neutral-800 p-2 outline outline-zinc-400 rounded-md focus:outline-2 focus:outline-indigo-400 cursor-pointer"
                                value={selectedDeviceId}
                                onChange={(e) => setSelectedDeviceId(e.target.value)}
                            >
                                {devices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Microphone ${device.deviceId}`}
                                </option>
                                ))}
                            </select>
                        </div>

                        <SelectSpeakerLanguage speakerLanguage={speakerLanguage} setSpeakerLanguage={setSpeakerLanguage} invalidForm={invalidForm}/>

                        <SelectTranslation selectedLanguages={selectedLanguages} setSelectedLanguages={setSelectedLanguages} invalidForm={invalidForm}/>

                    </form>
                }
            </div>

                {audioPermission ? 
                    <>
                        <Captions liveCaptions={liveCaptions}/>

                        <div className="bg-[#1c1c21] rounded-xl px-3 py-4">
                            <div className="w-full flex justify-center">

                            {recording ? 
                                <button 
                                    title="Stop recording"
                                    aria-label='Stop recording'
                                    onClick={stopRecording}
                                >
                                <img src={stop} alt="" className="w-[56px] h-[56px]"/>
                                </button>
                            :
                                <button 
                                    title="Start recording"
                                    aria-label='Start recording'
                                    className="p-3 rounded-full bg-indigo-500"
                                    onClick={startRecording}
                                >
                                <img src={start} alt="" className="w-8 h-8"/>
                                </button>
                            }
                            </div>

                            {/* temp button for debugging purposes */}
                            <button onClick={() => setLiveCaptions("")} className="w-full py-2 bg-indigo-500 mt-3">
                                Clear captions
                            </button>

                        </div>
                    </>
                :
                    <div className="w-full mx-auto my-auto flex flex-col items-center text-center">
                        <img src={Headphones} alt="" className="w-12 h-12"/>
                        <h3 className="text-lg font-semibold">Set up audio permissions</h3>
                        <p className="text-zinc-400 max-w-xs">
                            Grant permission to access your audio inputs, 
                            to use with caption streaming and audio management.
                        </p>

                        <button 
                            title="Open audio permissions"
                            aria-label="open audio permissions"
                            onClick={() => getAudioPermission}
                            className="bg-indigo-500 py-2 px-10 rounded-xl md:text-lg font-medium mt-7"
                        >Open audio permissions</button>
                    </div>
                }
        </section>
    );
}