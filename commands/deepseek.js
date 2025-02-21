const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "deepseek",
  description: "Interact with DeepSeek AI for text-based responses",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for DeepSeek AI to respond to." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://ccprojectapis.ddns.net/api/deepseek";
      const response = await handleDeepSeekRequest(apiUrl, userPrompt);

      // Ensure response is valid
      if (!response || !response.response) {
        throw new Error("Invalid API response.");
      }

      const result = response.response.trim();

      if (!result) {
        throw new Error("AI returned an empty response.");
      }

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in DeepSeek command:", error.message);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleDeepSeekRequest(apiUrl, query) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      id: "1"
    }
  });

  return data || {};
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (typeof text !== "string") {
    text = "❌ Error: Received unexpected response format.";
  }

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
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