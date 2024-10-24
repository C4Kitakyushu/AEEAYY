const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "gemini",
  description: "Get description of an image using the Gemini API.",
  author: "developer",

  async execute(metallic, bot, version, event) {
    const versionPrompt = bot.join(" ");

    if (!versionPrompt) {
      return sendMessage(metallic, { text: `❌ Use messenger to reply phto \n\nWxample : Gemnini what is Cat?` }, version);
    }

    sendMessage(metallic, { text: "⌛ Answering please wait
..." }, version);

    try {
      let imageUrl = "";

      // Ensure event.message is defined before accessing its properties
      if (event.message && event.message.reply_to && event.message.reply_to.mid) {
        imageUrl = await getRepliedImage(event.message.reply_to.mid, version);
      } else if (event.message && event.message.attachments && event.message.attachments[0]?.type === 'image') {
        imageUrl = event.message.attachments[0].payload.url;
      }

      const apiUrl = `https://joshweb.click/gemini`;

      const geminiResponse = await handleImageRecognition(apiUrl, versionPrompt, imageUrl);
      const result = geminiResponse.gemini;

      sendConcatenatedMessage(metallic, result, version);

    } catch (error) {
      console.error("Error in Gemini command:", error);
      sendMessage(metallic, { text: `Error: ${error.message || "Something went wrong."}` }, version);
    }
  }
};

async function handleImageRecognition(apiUrl, prompt, imageUrl) {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt,
      url: imageUrl || ""
    }
  });

  return data;
}

async function getRepliedImage(mid, version) {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: version }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    return "";
  }
}

async function sendConcatenatedMessage(metallic, text, version) {
  const maxMessageLength = 2000;

  if (text.length > maxMessageLength) {
    const messages = splitMessageIntoChunks(text, maxMessageLength);

    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
      await sendMessage(metallic, { text: messages[i] }, version);
    }
  } else {
    await sendMessage(metallic, { text }, version);
  }
}

function splitMessageIntoChunks(message, chunkSize) {
  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return message.match(regex);
}
