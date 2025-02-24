const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "gpt4o",
  description: "Interact with GPT-4 Omni for text-based responses",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event) {
    const userPrompt = args.join(" ").trim();
    const userId = event.sender.id;

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for GPT-4 Omni to respond to." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://yt-video-production.up.railway.app/gpt4-omni";
      const response = await handleGPT4OmniRequest(apiUrl, userPrompt, userId);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in GPT-4 Omni command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGPT4OmniRequest(apiUrl, query, userId) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      userid: userId
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
