const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "perplexity",
  description: "interact with perplexity sonaronline",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt && !imageUrl) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question or an image with a description for recognition." },
        pageAccessToken
      );
    }

    
    try {
      const apiUrl = "https://zaikyoo-api.onrender.com/api/sonaronline";
      const response = await handleSonaronlineRequest(apiUrl, userPrompt, senderId);
      const result = response.response || "no response from the ai.";
      
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("error in sonaronline command:", error);
      sendMessage(
        senderId,
        { text: `❌ error: ${error.message || "something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleSonaronlineRequest(apiUrl, query, uid) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt: query,
      uid: uid
    }
  });
  return data;
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);
    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}