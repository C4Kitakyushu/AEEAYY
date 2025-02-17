const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "ai",
  description: "interact to ai",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    // Check if the user provided a prompt
    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question." },
        pageAccessToken
      );
    }

    try {
      // Generate a random ID
      const randomIDs = Math.floor(Math.random() * 9) + 1;

      // Construct the API URL with the user's prompt
      const apiUrl = `https://ccprojectapis.ddns.net/api/gptconvo?ask=${encodeURIComponent(userPrompt)}&id=${randomIDs}`;

      // Make the API request
      const response = await axios.get(apiUrl);
      const result = response.data.response || "No response from the AI.";

      // Send the response back to the user
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in AI command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

// Helper function to send long messages in chunks
async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay to avoid rate limits
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

// Helper function to split long messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}