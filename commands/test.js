const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Generate AI responses or images based on user prompt",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a prompt for AI." },
        pageAccessToken
      );
    }

    const userPrompt = args.join(" ").trim();

    // Notify the user that the request is being processed
    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      // **Check if user wants to generate an image**
      if (userPrompt.toLowerCase().startsWith("generate")) {
        const imagePrompt = userPrompt.replace(/^generate\s+/i, "");
        const imageUrl = `https://ccprojectapis.ddns.net/api/generate-art?prompt=${encodeURIComponent(imagePrompt)}`;

        return sendMessage(
          senderId,
          {
            attachment: {
              type: "image",
              payload: { url: imageUrl },
            },
          },
          pageAccessToken
        );
      }

      // **Default AI Text Response Handling**
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
          return sendMessage(
            senderId,
            {
              attachment: {
                type: "image",
                payload: { url: imageUrl },
              },
            },
            pageAccessToken
          );
        }
      }

      // **Send AI Text Response**
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in ai3 command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  },
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