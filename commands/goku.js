const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "goku",
  description: "Interact with Goku AI",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: `❌ Please provide a prompt for Goku AI to respond to.` },
        pageAccessToken
      );
    }

    try {
      const apiUrl = "https://kaiz-apis.gleeze.com/api/goku";
      const response = await handleGokuRequest(apiUrl, userPrompt, senderId);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in Goku command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGokuRequest(apiUrl, query, userId) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      uid: userId || "1"
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