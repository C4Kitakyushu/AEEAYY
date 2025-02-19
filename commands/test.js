const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "test",
  description: "Generate AI responses using echoAI with tool call support",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question or prompt for AI to respond." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      const apiUrl = `https://echoai.zetsu.xyz/ask?q=${encodeURIComponent(userPrompt)}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (!result || typeof result !== "string") {
        throw new Error("Invalid response from AI.");
      }

      // **Tool Call Handling**
      if (result.includes("TOOL_CALL: generateImage")) {
        const imageUrlMatch = result.match(/\!.*?(https:\/\/.*?)/);

        if (imageUrlMatch && imageUrlMatch[1]) {
          const imageUrl = imageUrlMatch[1];
          await sendMessage(
            senderId,
            {
              attachment: {
                type: "image",
                payload: { url: imageUrl },
              },
            },
            pageAccessToken
          );
          return;
        }
      }

      // **Send AI Response**
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in AI3 command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

// **Helper Functions**
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