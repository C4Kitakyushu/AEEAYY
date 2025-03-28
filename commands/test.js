const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Interact with Meta AI (Llama)",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        {
          text: `❌ Please enter a prompt. Example: metaai Tell me a story.`,
        },
        pageAccessToken
      );
    }

    try {
      // Notify user of processing
      await sendMessage(
        senderId,
        { text: `[ Meta AI (Llama) ]\n\nPlease wait...` },
        pageAccessToken
      );

      // Fetch response from the API
      const apiUrl = "https://zen-api.up.railway.app/api/metaai";
      const response = await handleMetaAIRequest(apiUrl, userPrompt);

      const result = response.response || "No response from Meta AI.";

      // Send the response back to the user
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in Meta AI command:", error);
      sendMessage(
        senderId,
        { text: `❌ Failed to fetch data. Please try again later.\n\nError: ${error.message}` },
        pageAccessToken
      );
    }
  },
};

async function handleMetaAIRequest(apiUrl, prompt) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt: prompt,
    },
  });

  return data;
}

async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
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
}

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}