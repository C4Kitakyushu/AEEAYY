const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Interact with ChatGPT for AI-generated responses",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        {
          text: `❌ Please provide a prompt for ChatGPT to respond to.`
        },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      {
        text: "⌛ Processing your request, please wait..."
      },
      pageAccessToken
    );

    try {
      const apiUrl = "https://mitski.onrender.com/api/chatgpt";
      const response = await handleChatGPTRequest(apiUrl, userPrompt);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);

    } catch (error) {
      console.error("Error in ChatGPT command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleChatGPTRequest(apiUrl, query) {
  const { data } = await axios.get(apiUrl, {
    params: {
      userId: "1",
      question: query || ""
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