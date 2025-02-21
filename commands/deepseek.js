const axios = require("axios");
const { sendMessage } = require("../handles/sendMessage");

module.exports = {
  name: "deepseek",
  description: "interact with DeepSeek AI for text-based responses",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt && !imageUrl) {
      return sendMessage(
        senderId,
        {
          text: `❌ Please provide a prompt for the AI to respond to.`
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
      // Check if an image is attached or replied to
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === "image") {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      const apiUrl = "https://kaiz-apis.gleeze.com/api/deepseek-r1";
      const response = await handleDeepSeekRequest(apiUrl, userPrompt, imageUrl);

      const result = response.response;

      await sendConcatenatedMessage(senderId, result, pageAccessToken);

    } catch (error) {
      console.error("Error in DeepSeek command:", error);
      sendMessage(
        senderId,
        { text: `❌ Error: ${error.message || "Something went wrong."}` },
        pageAccessToken
      );
    }
  }
};

async function handleDeepSeekRequest(apiUrl, query, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      ask: query || "",
      imageUrl: imageUrl || ""
    }
  });

  return data;
}

async function getRepliedImage(mid, pageAccessToken) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data?.data?.[0]?.image_data?.url) {
    return data.data[0].image_data.url;
  }

  return "";
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