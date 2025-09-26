const { logger } = require("../utils/logger");
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function TTSAudioService(socket, text){
    try{

        const audioFile = await openai.audio.speech.create({
            model: "gpt-4o-mini-tts",
            voice: "onyx",
            input: text,
            // instructions: "Speak in a cheerful and positive tone.",
            response_format: "wav"
        });


        const buffer = Buffer.from(await audioFile.arrayBuffer());

        // console.log("TTS ran");
        return buffer;
    }
    catch(err){
        logger.error('TTS Audio error:', err);
        socket.emit('ttsAudio:error', { 
        message: 'TTS audio creation failed',
        error: err.message 
        });
    }
}

module.exports = { TTSAudioService };