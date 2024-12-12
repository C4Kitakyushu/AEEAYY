const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "test",
  description: "Interact with Gemini API for both text and image recognition",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim().toLowerCase();

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
      if (!imageUrl) {
        if (event.message?.reply_to?.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, pageAccessToken);
        } else if (event.message?.attachments?.[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      const textApiUrl = "http://sgp1.hmvhostings.com:25721/gemini";
      const imageRecognitionUrl = "https://api.joshweb.click/gemini";

      const useImageRecognition =
        imageUrl || 
        ["recognize", "analyze", "please", "answer", "analyst", "analysis"].some(term => userPrompt.includes(term)); // Check trigger words

      let responseMessage;

      if (useImageRecognition) {
        // Fetch from Gemini Flash Vision (image recognition)
        const imageApiResponse = await axios.get(imageRecognitionUrl, {
          params: { prompt: userPrompt, url: imageUrl || "" }
        });
        const imageRecognitionResponse = imageApiResponse.data.gemini || "❌ No response from Gemini Flash Vision.";
        responseMessage = `{imageRecognitionResponse}`;
      } else {
        // Fetch from Gemini Advanced (text)
        const textApiResponse = await axios.get(textApiUrl, { params: { question: userPrompt } });
        const textResponse = textApiResponse.data.answer || "❌ No response from Gemini Advanced.";
        responseMessage = `${textResponse}`;
      }

      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      // Final formatted response
      const finalResponse = `✨• 𝗚𝗲𝗺𝗶𝗻𝗶 𝗔𝗱𝘃𝗮𝗻𝗰𝗲𝗱  𝗔𝗜\n━━━━━━━━━━━━━━━━━━
${responseMessage}
━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

      await sendConcatenatedMessage(senderId, finalResponse, pageAccessToken);

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
