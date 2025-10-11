const { logger } = require('../utils/logger');
const { TranscriptionService } = require('../services/TranscriptionService');
const { TranslationService } = require('../services/TranslationService');
const { TTSAudioService } = require('../services/TTSAudioService');

// Track active connections
const activeConnections = new Map();

/**
 * Setup all WebSocket event handlers
 * @param {Server} io - Socket.IO server instance
 */
function setupSocketHandlers(io) {

  // keep track of active listeners/languages
  const activeListeners = {};

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    
    // Store connection info
    activeConnections.set(socket.id, {
      connectedAt: new Date(),
      lastActivity: new Date()
    });

    // General events
    socket.on('ping', () => {
      console.log("Received ping");
      socket.broadcast.emit('pong', {text: "pong"});
      updateLastActivity(socket.id);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      handleDisconnect(socket, reason);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });

    // Handle broadcasting language settings
    socket.on('language:data', ({ speakerLanguage, selectedLanguages }) => {
      socket.speakerLanguage = speakerLanguage;
      socket.selectedLanguages = selectedLanguages;

      socket.broadcast.emit('available-translations', {
        speakerLanguage,
        selectedLanguages
      });
    })

    // Handle transcribing speaker's audio
    socket.on('transcribe:audio', async (data) => {
      let transcriptionResult = await handleTranscribeAudio(socket, data);

      // filter out lanuages that aren't 
      // being "listened" to by the users
      const activeLangs = [];
      for (const lang of socket.selectedLanguages) {
        if (activeListeners[lang.label]?.size > 0) {
          activeLangs.push(lang.label);
        }
      }

      if (activeLangs.length === 0) {
        // console.log("No active listeners, skipping translations.");
        return;
      }

      await Promise.all(
        activeLangs.map(async (lang) => {
          handleTranslationRequest(socket, transcriptionResult, lang);
      }));

    });

    socket.on("start-listening", (lang) => {
      if (!activeListeners[lang]){
        activeListeners[lang] = new Set();
      }
      activeListeners[lang].add(socket.id);

      // console.log(`${socket.id} started listening to ${lang}`);
    });

    socket.on("stop-listening", (lang) => {
      if (activeListeners[lang]) {
        activeListeners[lang].delete(socket.id);
        if (activeListeners[lang].size === 0){
          delete activeListeners[lang];
        }
      }
      // console.log(`${socket.id} stopped listening to ${lang}`);
    });

    socket.on("disconnect", () => {
      // Clean up this socket from all language sets
      for (const lang in activeListeners) {
        activeListeners[lang].delete(socket.id);
        if (activeListeners[lang].size === 0){
          delete activeListeners[lang];
        }
      }
    });

  });

  // Broadcast server stats periodically
  setInterval(() => {
    io.emit('server:stats', {
      activeConnections: activeConnections.size,
      timestamp: new Date().toISOString()
    });
  }, 30000); // Every 30 seconds
}

// Handle client identification
// function handleClientIdentify(socket, data) {
//   try {
//     logger.info(`Client ${socket.id} identified:`, data);
    
//     // Store client info
//     const connectionInfo = activeConnections.get(socket.id);
//     if (connectionInfo) {
//       connectionInfo.clientInfo = data;
//       connectionInfo.lastActivity = new Date();
//     }

//     // Join specific rooms if needed
//     if (data.room) {
//       socket.join(data.room);
//       logger.info(`Client ${socket.id} joined room: ${data.room}`);
//     }

//     socket.emit('client:identified', {
//       success: true,
//       socketId: socket.id,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     logger.error('Error handling client identification:', error);
//     socket.emit('error', { message: 'Failed to identify client' });
//   }
// }

// Handle incoming audio data for transcription
async function handleTranscribeAudio(socket, audioData) {

  try {
    updateLastActivity(socket.id);
    
    // Process audio data for transcription
    const transcriptionResult = await TranscriptionService(socket, audioData);

    // conditional statement to prevent prompt leak
    if (transcriptionResult != null){

      // Emit transcription results for the host
      socket.emit('transcription:result', {
        text: transcriptionResult,
        timestamp: new Date().toISOString()
      });

      return transcriptionResult;
    }

  } catch (error) {
    logger.error('Transcription audio error:', error.message);
    socket.emit('transcription:error', { 
      message: 'Audio processing failed',
      error: error.message 
    });
  }
}

// Handle translation requests
async function handleTranslationRequest(socket, text, language) {
  try {
    updateLastActivity(socket.id);
    
    // Validate request data
    if (!text || !language) {
      socket.emit('translation:error', { 
        message: 'Missing required text' 
      });
      return;
    }

    const translatedText = await TranslationService(socket, text, language);
    const audioFile = await TTSAudioService(socket, translatedText, language);

    // emit results
    socket.broadcast.emit(`translation-results:${language}`, {
      text: translatedText,
      audio: audioFile,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Translation error:', error);
    socket.emit('translation:error', { 
      message: 'Translation failed',
      error: error.message 
    });
  }
}

// Handle client disconnection
function handleDisconnect(socket, reason) {
  logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
  
  // Clean up resources
  activeConnections.delete(socket.id);
}

/**
 * Update last activity timestamp
 */
function updateLastActivity(socketId) {
  const connectionInfo = activeConnections.get(socketId);
  if (connectionInfo) {
    connectionInfo.lastActivity = new Date();
  }
}

/**
 * Get active connections count
 */
function getActiveConnectionsCount() {
  return activeConnections.size;
}

/**
 * Get connection info
 */
function getConnectionInfo(socketId) {
  return activeConnections.get(socketId);
}

module.exports = {
  setupSocketHandlers,
  getActiveConnectionsCount,
  getConnectionInfo
};