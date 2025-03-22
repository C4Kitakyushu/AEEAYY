const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "ai",
  description: "interact with gemini ai",
  author: "developer",

  async execute(senderId, args) {
    const pageAccessToken = token;
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: " Kindly provide your specific questions." },
        pageAccessToken
      );
    }

    await handleTextRecognition(senderId, userPrompt, pageAccessToken);
  },
};

const handleTextRecognition = async (senderId, prompt, pageAccessToken) => {
  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision`;
    const { data } = await axios.get(apiUrl, {
      params: {
        q: prompt,
        uid: senderId,
      },
    });

    const responseText = data.response || "❌ No response from Gemini Vision.";
    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in Gemini Vision command:", error);
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