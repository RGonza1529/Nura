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
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    
    // Store connection info
    activeConnections.set(socket.id, {
      connectedAt: new Date(),
      lastActivity: new Date()
    });

    // 
    socket.on('transcribe:audio', (data) => {
      handleTranscribeAudio(socket, data);
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

      // translate the transcribed text
      handleTranslationRequest(socket, transcriptionResult);

      // Emit transcription results
      socket.emit('transcription:result', {
        text: transcriptionResult,
        timestamp: new Date().toISOString()
      });
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
async function handleTranslationRequest(socket, data) {
  try {
    updateLastActivity(socket.id);
    
    // Validate request data
    if (!data) {
      socket.emit('translation:error', { 
        message: 'Missing required text' 
      });
      return;
    }

    const translatedText = await TranslationService(socket, data);
    const audioFile = await TTSAudioService(socket, translatedText);
    
    // emit results
    socket.broadcast.emit('translation:result', {
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