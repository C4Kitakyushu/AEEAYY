const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "ai",
  description: "Interact with GPT-4o for AI-powered responses",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question for GPT-4o to answer." },
        pageAccessToken
      );
    }

    await handleGPT4oResponse(senderId, userPrompt, pageAccessToken);
  },
};

const handleGPT4oResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o";

  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        ask: input,
        uid: "4",
        webSearch: "off",
      },
    });

    console.log("API Response:", data); // Log the API response for debugging

    const responseText = data.reply || "❌ No valid response received from GPT-4o.";
    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in gpt4o command:", error);
    await sendError(senderId, "❌ Error: Something went wrong.", pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
  const maxMessageLength = 2000;

  if (!text || typeof text !== "string") {
    text = "❌ Response is empty or invalid.";
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