const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "ai3",
  description: "interact with gpt4-o",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a message for GPT-4o to respond to." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o";
      const response = await handleGPT4oRequest(apiUrl, userPrompt);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in GPT-4o command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGPT4oRequest(apiUrl, query) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      uid: "1",
      webSearch: "off"
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