const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "gpt",
  description: "Interact with GPT AI",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: `❌ Please provide a prompt for GPT AI to respond to.` },
        pageAccessToken
      );
    }

    try {
      const apiUrl = "https://elevnnnx-rest-api.onrender.com/api/gpt";
      const response = await handleGPTRequest(apiUrl, userPrompt);

      const result = response.response || response.error || "No response from the AI.";
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in GPT command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGPTRequest(apiUrl, query) {
  const { data } = await axios.get(`${apiUrl}?q=${encodeURIComponent(query)}`);
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