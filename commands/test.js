const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "test",
  description: "Interact with Deepseek AI",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "Please provide a question." },
        pageAccessToken
      );
    }

    await handleDeepseekResponse(senderId, userPrompt, pageAccessToken);
  },
};

const handleDeepseekResponse = async (senderId, input, pageAccessToken) => {
  const userID = senderId || Math.floor(Math.random() * 10000);
  const apiUrl = `https://kaiz-apis.gleeze.com/api/deepseek-v3?ask=${encodeURIComponent(input)}&uid=${userID}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data.response || "No response from the AI.";

    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in Deepseek AI command:", error);
    await sendError(senderId, "❌ Error: Deepseek AI is unavailable.", pageAccessToken);
  }
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