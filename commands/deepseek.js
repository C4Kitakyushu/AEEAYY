const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "deepseek",
  description: "interact with deepseek ai",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for Deepseek AI to respond to." },
        pageAccessToken
      );
    } 

    try {
      const apiUrl = "https://markdevs-last-api-p2y6.onrender.com/deepseek";
      const response = await handleDeepseekRequest(apiUrl, userPrompt, senderId);

      const result = response.response || "No response from the AI.";

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in Deepseek command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleDeepseekRequest(apiUrl, query, uid) {
  const { data } = await axios.get(apiUrl, {
    params: {
      chat: query,
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
