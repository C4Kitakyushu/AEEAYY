const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Perform a search query using an external API",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const userQuery = args.join(" ").trim();

    if (!userQuery) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a search query." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Searching, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = "https://elevnnnx-rest-api.onrender.com/api/search";
      const response = await handleSearchRequest(apiUrl, userQuery);

      const result = response.result || "No results found.";

      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in search command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleSearchRequest(apiUrl, query) {
  const { data } = await axios.get(apiUrl, {
    params: {
      query: query || ""
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
