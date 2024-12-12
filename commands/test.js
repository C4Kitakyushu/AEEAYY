const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "test",
  description: "Interact with Gemini API for both text and image recognition",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();

    if (!userPrompt && !imageUrl) {
      return sendMessage(
        senderId,
        { 
          text: `❌ Please provide a question for Gemini Advanced or an image with a description for Flash Vision.` 
        }, 
        pageAccessToken
      );
    }

    sendMessage(
      senderId,
      { text: "⌛ Processing your request, please wait..." },
      pageAccessToken
    );

    try {
      // Handle image input if not directly provided
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      const apiUrl = "http://sgp1.hmvhostings.com:25721/gemini";
      const imageRecognitionUrl = "https://api.joshweb.click/gemini";

      // Prepare response variables
      let textResponse = "";
      let imageRecognitionResponse = "";

      // Fetch from Gemini Advanced (text)
      if (userPrompt) {
        const textApiResponse = await axios.get(apiUrl, { params: { question: userPrompt } });
        textResponse = textApiResponse.data.answer || "❌ No response from Gemini Advanced.";
      }

      // Fetch from Gemini Flash Vision (image recognition)
      if (imageUrl) {
        const imageApiResponse = await axios.get(imageRecognitionUrl, { params: { prompt: userPrompt, url: imageUrl } });
        imageRecognitionResponse = imageApiResponse.data.gemini || "❌ No response from Gemini Flash Vision.";
      }

      // Get current response time in Manila timezone
      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      // Format the combined response
      const combinedResponse = `𝗚𝗲𝗺𝗶𝗻𝗶 𝗔𝗣𝗜 ♊\n━━━━━━━━━━━━━━━━━━\n${
        textResponse ? `📖 𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱 𝗔𝗜 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n${textResponse}\n\n` : ""
      }${
        imageRecognitionResponse ? `🖼️ 𝗙𝗹𝗮𝘀𝗵 𝗩𝗶𝘀𝗶𝗼𝗻 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲:\n${imageRecognitionResponse}\n` : ""
      }━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

      await sendConcatenatedMessage(senderId, combinedResponse, pageAccessToken);

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
