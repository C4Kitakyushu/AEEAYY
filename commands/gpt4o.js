const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "gpt4o",
  description: "Interact with GPT-4 Omni for text-based responses",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for GPT-4 Omni to respond to." },
        pageAccessToken
      );
    }

    await handleChatResponse(senderId, userPrompt, pageAccessToken);
  },
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://yt-video-production.up.railway.app/gpt4-omni";

  try {
    const response = await handleGPT4OmniRequest(apiUrl, input, senderId);
    const result = response.response;

    await sendConcatenatedMessage(senderId, result, pageAccessToken);
  } catch (error) {
    console.error("Error in GPT-4 Omni command:", error);
    await sendError(senderId, "❌ Error: Something went wrong.", pageAccessToken);
  }
};

const handleGPT4OmniRequest = async (apiUrl, query, userId) => {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      userid: userId,
    },
  });
  return data;
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};
