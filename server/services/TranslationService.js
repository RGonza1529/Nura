const { logger } = require("../utils/logger");
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function TranslationService(socket, text, language){
    try{
        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            instructions: `You are a helpful assistant. your job is simple--to take this ${socket.speakerLanguage} text from a Christian sermon and translate into ${language}. respond with the translation only`,
            input: text,
        });
        
        // console.log(response.output_text);

        return response.output_text;

    }
    catch(err){
        logger.error('Translation error:', err);
        socket.emit('translation:error', { 
        message: 'Translation processing failed',
        error: err.message 
        });
    }
}

module.exports = { TranslationService };
