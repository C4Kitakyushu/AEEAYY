const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "ai3",
  description: "Interact with Google Gemini API",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    // Check if user provided a prompt or an image
    if (!userPrompt && !imageUrl) {
      return sendMessage(
        senderId,
        {
          text: `❌ Please provide a question or an image along with a description for recognition.`
        },
        pageAccessToken
      );
    }

    // Acknowledge the user's request
    sendMessage(
      senderId,
      {
        text: "⌛ Processing your request, please wait..."
      },
      pageAccessToken
    );

    try {
      // Handle image URL if provided or attached
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === "image") {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      // Construct the API URL with the user's prompt
      const apiUrl = `http://sgp1.hmvhostings.com:25721/gemini?question=${encodeURIComponent(userPrompt)}`;

      // Make the API request
      const response = await axios.get(apiUrl);
      const result = response.data.response || "No response from Gemini.";

      // Send the response back to the user
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

// Helper function to get the image URL from a replied message
async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data?.data?.[0]?.image_data?.url) {
    return data.data[0].image_data.url;
  }

  return "";
}

// Helper function to send long messages in chunks
async function sendConcatenatedMessage(senderId, text, pageAccessToken) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (const message of messages) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay to avoid rate limits
      await sendMessage(senderId, { text: message }, pageAccessToken);
    }
  } else {
    await sendMessage(senderId, { text }, pageAccessToken);
  }
}

// Helper function to split long messages into chunks
function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}