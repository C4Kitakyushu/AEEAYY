const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "brave",
  description: "Interact with Brave AI for text-based responses",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for Brave AI to respond to." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://markdevs-last-api-p2y6.onrender.com/brave-ai";
      const response = await handleBraveAIRequest(apiUrl, userPrompt);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in Brave AI command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleBraveAIRequest(apiUrl, query) {
  const { data } = await axios.get(apiUrl, {
    params: {
      q: query || "",
      uid: "1"
    }
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
