const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "test",
  description: "Recognize or generate images using AI",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt && !imageUrl) {
      return sendMessage(
        senderId,
        { text: "❌ Provide a description for image generation or an image URL for recognition." },
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      // Check if an image is replied to or attached
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === "image") {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      // API URL
      const apiUrl = "https://kaiz-apis.gleeze.com/api/chipp-ai";
      const response = await handleAIRequest(apiUrl, userPrompt, imageUrl);

      // Extract API response
      const result = response.response;

      // Check if the response includes an image generation tool call
      if (result.includes("TOOL_CALL: generateImage")) {
        const imageUrlMatch = result.match(/\!.*?(https:\/\/.*?)/);

        if (imageUrlMatch && imageUrlMatch[1]) {
          const imageUrl = imageUrlMatch[1];
          await sendMessage(
            senderId,
            {
              attachment: { type: "image", payload: { url: imageUrl } }
            },
            pageAccessToken
          );
          return;
        }
      }

      // Send the text response
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

// Function to handle API request
async function handleAIRequest(apiUrl, query, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      uid: "1",  // Using UID 1 as per API
      imageUrl: imageUrl || ""
    }
  });

  return data;
}

// Function to retrieve an image from a replied message
async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  return data?.data?.[0]?.image_data?.url || "";
}

// Function to send long messages in chunks
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

// Function to split long messages
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}