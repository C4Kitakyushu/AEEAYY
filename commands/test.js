const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "test",
  description: "Generate AI responses and images using echoAI and Zetsu Art API",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Please provide a question or an image description." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      // **Check if user wants an image**
      if (userPrompt.toLowerCase().startsWith("generate image")) {
        const promptText = userPrompt.replace(/generate image/gi, "").trim();
        
        if (!promptText) {
          return sendMessage(
            senderId,
            { text: "❌ Please provide a description for the image." },
            pageAccessToken
          );
        }

        const imageUrl = await generateImage(promptText);

        if (imageUrl) {
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
        } else {
          return sendMessage(
            senderId,
            { text: "❌ Failed to generate an image. Please try again." },
            pageAccessToken
          );
        }
      }

      // **Text AI Response Handling**
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

// **Image Generation Function**
async function generateImage(prompt) {
  try {
    const apiUrl = `https://api.zetsu.xyz/api/art?prompt=${encodeURIComponent(prompt)}`;
    const response = await axios.get(apiUrl);
    
    if (response.data && response.data.image_url) {
      return response.data.image_url;
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

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