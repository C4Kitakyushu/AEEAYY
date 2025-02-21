const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "catgpt",
  description: "Interact with CatGPT AI for text-based responses",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for CatGPT AI to respond to." },
        pageAccessToken
      );
    }

    await handleCatGPTRequest(senderId, userPrompt, pageAccessToken);
  },
};

const handleCatGPTRequest = async (senderId, input, pageAccessToken) => {
  const apiUrl = `https://jerome-web.gleeze.com/service/api/catgpt?message=${encodeURIComponent(input)}`;

  try {
    const { data } = await axios.get(apiUrl);
    const responseText = data.response || "No response from CatGPT AI.";

    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in CatGPT command:", error);
    await sendError(senderId, "❌ Error: Something went wrong.", pageAccessToken);
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