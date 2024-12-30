const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "tint",
  description: "Generate AI response using the Gemini-Pro API",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        {
          text: `❌ Please provide a prompt for processing.`
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
      const apiUrl = "https://jerome-web.gleeze.com/service/api/gemini-pro";
      const response = await handleGeminiRequest(apiUrl, userPrompt);

      if (!response || !response.response) {
        throw new Error("No valid response received from the API.");
      }

      const result = response.response;

      // Send the result back to the user
      await sendConcatenatedMessage(senderId, result, pageAccessToken);
    } catch (error) {
      console.error("Error in Gemini command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleGeminiRequest(apiUrl, prompt) {
  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        prompt: prompt,
        stream: false
      },
      timeout: 10000 // Add a timeout to prevent hanging requests
    });

    console.log("API Response:", data); // Log the API response for debugging
    return data;
  } catch (error) {
    console.error("Error during API request:", error.response?.data || error.message);
    throw new Error("Failed to fetch data from the Gemini-Pro API.");
  }
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