const { logger } = require("../utils/logger");
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function TranscriptionService(socket, audioData){
    try{

        const audioFile = new File([audioData], 'audio.webm', {
            type: 'audio/webm;codecs=opus'
        });

        const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "gpt-4o-transcribe",
            language: "en",
            response_format: "text",
            chunking_strategy: "auto",
            temperature: '0.2',
            // prompt: "You are transcribing an English audio file of a Christian sermon"
        });

        // const transcription = "hello"

        // returns null if transcription is empty
        if (transcription.length < 2){
            return null;
        }
        else{
            return transcription;
        }
    }
    catch(err){
        logger.error('Transcription error:', err);
        socket.emit('transcription:error', { 
        message: 'Transcription processing failed',
        error: err.message 
        });
    }
}

module.exports = { TranscriptionService };