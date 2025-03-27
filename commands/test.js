const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

const token = "your_token_here";

module.exports = {
  name: "test',
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
    const responseText = data.response || "I couldn't understand your question.";
    await sendMessage(senderId, { text: responseText }, pageAccessToken);
  } catch (error) {
    console.error("Error in Deepseek AI command:", error);
    await sendError(senderId, "❌ Deepseek AI is unavailable.", pageAccessToken);
  }
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};