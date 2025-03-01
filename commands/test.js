const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "interact with gpt-4",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ please provide a prompt for gpt-4 to respond." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://markdevs-last-api.onrender.com/gpt4";
      const response = await handleGPT4Request(apiUrl, userPrompt, senderId);
      const result = response.response || "no response from the ai.";
      
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("error in gpt-4 command:", error);
      sendMessage(
        senderId,
        { text: `❌ error: ${error.message || "something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGPT4Request(apiUrl, query, uid) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt: query,
      uid: uid
    }
  });
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