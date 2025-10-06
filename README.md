# Nura

A Full-Stack React/Node.js AI-powered web application that provides real-time translation and transcription for live events with Text-to-Speech support.

This project is meant to be easy and fast to deploy and use for every user involved--both the host and the end user.

The primary function of this app is to make live speaking events more accessible to a multilingual audience. 

## Supported Languages

I developed this app specifically to transcribe English speech and translate it to Spanish, but this app supports the following languages:

Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.


## Getting Started

To set up the project locally, follow these steps:

1. **Install Dependencies**

   Navigate to both the `client` and `server` directories and install the required dependencies using the following command:

   ```bash
   npm install
   ```

   Make sure you run this command **in each folder** individually (both `/client` and `/server`).

2. **Add Your OpenAI API Key**

   In the /server directory, create a `.env` file that mimics `.env.example` and add your OpenAI API key like so:

   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. **Establish the WebSocket Connection**

   To enable real-time communication between the client and server, you’ll need to establish a WebSocket connection:

   * First, make sure the **server** is running on a specific port (for example, the default `5000` port).

   * Next, navigate to the client’s WebSocket configuration file at:

     ```
     client/Websocket/socket.js
     ```

   * Inside this file, modify the connection URL so that it points to your running server’s address.
     If you’re running everything locally with the default settings, the WebSocket connection should look like this:

     ```javascript
     const socket = io("SERVER_ADDRESS", {withCredentials: true, transports: ["websocket"],});
     ```


4. **Run the Project Locally**

   Once dependencies are installed, the `.env` file is configured, and the Websocket connection is establed you’re ready to test the project locally.


## Commands

### Development Environment

To run both the client and server code in a **non-production (development)** environment, use:

```bash
npm run dev
```

### Production Environment

For a **production** setup:

* **Start the server** with:

  ```bash
  npm start
  ```

* **Build the client** for production (this creates a `dist` folder in the client directory):

  ```bash
  npm run build
  ```

## A Deeper Look

The **server-side code** is responsible for establishing a WebSocket connection and handling the core business logic of the application. It manages the flow of communication between the client and the server, processes audio data, and interacts with the OpenAI API for transcription and translation.

### Server Overview

The entry point of the backend logic begins with the `app.js` file, located in the `/src` directory. This file initializes the core components of the server, including the WebSocket connection and any necessary middleware.

WebSocket-specific code can be found in the `/websocket` directory and the `socketHandlers.js` file. These files define and manage all of the WebSocket “endpoints” used throughout the app.

### WebSocket Endpoints

The WebSocket server exposes several key endpoints that handle different parts of the communication process:

* **`ping`**
  Used to test the WebSocket connection. When the client sends a `ping` message, the server responds with a `pong` message, confirming that the connection is active.

* **`connection`**
  Triggered each time a new client connects. This endpoint logs every successful WebSocket connection to the server.

* **`disconnect`**
  Handles logic for when a client disconnects from the WebSocket server.

* **`error`**
  Captures and logs any WebSocket-related errors that occur during communication.

* **`transcribe:audio`**
  This is the first endpoint directly tied to the core functionality of the app. It is triggered when the client sends an **audio chunk** to the server.
  The server expects this audio chunk as input, then calls an internal function to start the **transcription and translation process**. Once the transcription is complete, the server moves on to emit the results back to the client through the corresponding emit endpoints.

### Emit Endpoints

The server emits results back to the client through specific emit endpoints:

* **`transcription:result`**
  Emits the **transcribed text** of the received audio chunk once the transcription process is complete.

* **`translation:result`**
  Emits the **translation result**, which includes both the translated text and a **Text-to-Speech (TTS)** audio file of that translation.

### Business Logic and Services

All core business logic and OpenAI API interactions are handled within the `/services` directory.
This folder contains the modules responsible for making API calls, managing transcription and translation processes, and returning results to the WebSocket layer.

### Client Overview

On the client side, the root of the application can be found inside the `/client/src` directory, with the main entry point being the `App.jsx` file. This is where the overall structure of the front-end is initialized and where different components and pages are brought together.

### Recording Logic

The main recording logic for the client lives inside the `/client/src/Components` folder, specifically in the `Host.jsx` file.
This component is responsible for handling microphone input, recording audio, and sending it to the backend for transcription.

The project uses the **MediaRecorder API** to capture audio from the user’s microphone. The recording process is designed to collect audio in **seven-second chunks**, which are then sent to the backend through the WebSocket endpoint:

```
transcribe:audio
```

Within the same file (`Host.jsx`), you’ll also find a `useEffect` hook that listens for incoming transcription results from the server. These results are emitted from the `transcription:result` WebSocket endpoint.

This listener allows the client to verify that the app is successfully communicating with the backend, display transcribed text in real time, and check the accuracy of the transcription process.

### Translation & Text-to-Speech

The next key part of the client can be found in the `/client/src/Pages` directory, within the `Listener.jsx` file.
This component is responsible for displaying the **translation** and **Text-to-Speech (TTS)** functionality.

Here, the client receives translation results from the `translation:result` WebSocket endpoint, which includes both the translated text and the accompanying audio file generated via Text-to-Speech. This allows users to not only read but also **listen** to the translated output directly from the browser.

## Running Costs

With my approach, and without including hosting costs, the app costs about $0.80/hour to use. This is assuming that the app is translating to only one language. Even then, this app is relatively cheap to run. 
