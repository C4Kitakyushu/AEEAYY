const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");
const fs = require("fs");

const token = fs.readFileSync("token.txt", "utf8");

module.exports = {
  name: "ai",
  description: "Interact with Gemini Vision via Kaiz API",
  author: "developer",

  async execute(senderId, args, event, imageUrl) {
    const pageAccessToken = token;
    const userPrompt = (args.join(" ") || "Hello").trim();
    const repliedMessage = event.message.reply_to?.message || "";
    const finalPrompt = repliedMessage ? `${repliedMessage} ${userPrompt}`.trim() : userPrompt;

    if (!finalPrompt) {
      return sendMessage(
        senderId,
        { text: "❌ Kindly provide your specific questions." },
        pageAccessToken
      );
    }

    // Handle image retrieval if imageUrl is missing
    if (!imageUrl) {
      imageUrl = await getImageFromEvent(event, pageAccessToken);
    }

    await handleGeminiResponse(senderId, finalPrompt, imageUrl, pageAccessToken);
  },
};

const handleGeminiResponse = async (senderId, prompt, imageUrl, pageAccessToken) => {
  const apiUrl = `https://kaiz-apis.gleeze.com/api/gemini-vision`;

  try {
    const { data } = await axios.get(apiUrl, {
      params: {
        q: prompt,
        uid: senderId,
        imageUrl: imageUrl || ""
      }
    });

    const responseText = data?.response || "No response from the AI.";
    await sendConcatenatedMessage(senderId, responseText, pageAccessToken);
  } catch (error) {
    console.error("Error in Gemini Vision command:", error);
    await sendError(senderId, "❌ Error: Something went wrong.", pageAccessToken);
  }
};

const getImageFromEvent = async (event, pageAccessToken) => {
  try {
    if (event.message.reply_to && event.message.reply_to.mid) {
      const { data } = await axios.get(`https://graph.facebook.com/v21.0/${event.message.reply_to.mid}/attachments`, {
        params: { access_token: pageAccessToken }
      });
      return data?.data[0]?.image_data?.url || "";
    } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
      return event.message.attachments[0].payload.url;
    }
    return "";
  } catch (error) {
    console.error("Failed to retrieve replied image:", error);
    return "";
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
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
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
};