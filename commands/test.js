const axios = require("axios");
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: "test",
  description: "Interact with Gemini 1.5 flash vision or ask the AI assistant.",
  author: "developer",

  async execute(senderId, args, pageAccessToken, event, imageUrl) {
    const userPrompt = args.join(" ").trim();
    if (!userPrompt && !imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗼𝗿 𝗶𝗺𝗮𝗴𝗲 𝗮𝗻𝗱 𝘁𝘆𝗽𝗲 𝘆𝗼𝘂𝗿 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 𝘁𝗼 𝗿𝗲𝗰𝗼𝗴𝗻𝗶𝘇𝗲...`
      }, token);
    }

    sendMessage(senderId, { text: "⌛ 𝗔𝗻𝘀𝘄𝗲𝗿𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁.." }, token);

    try {
      if (!imageUrl) {
        if (event.message.reply_to && event.message.reply_to.mid) {
          imageUrl = await getRepliedImage(event.message.reply_to.mid, token);
        } else if (event.message?.attachments && event.message.attachments[0]?.type === 'image') {
          imageUrl = event.message.attachments[0].payload.url;
        }
      }

      if (imageUrl || userPrompt) {
        const apiUrl = `https://joshweb.click/gemini`;
        const response = await handleImageRecognition(apiUrl, userPrompt, imageUrl);
        const result = response.gemini;

        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
        const message = `𝗚𝗲𝗺𝗶𝗻𝗶 1.5 𝗙𝗹𝗮𝘀𝗵 𝗩𝗶𝘀𝗶𝗼𝗻 ♊\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`;

        await sendConcatenatedMessage(senderId, message, token);
      } else {
        await handleChatResponse(senderId, userPrompt, token);
      }

    } catch (error) {
      console.error("Error in command execution:", error);
      sendMessage(senderId, { text: `Error: ${error.message || "Something went wrong."}` }, token);
    }
  },
};

const handleImageRecognition = async (apiUrl, prompt, imageUrl) => {
  const { data } = await axios.get(apiUrl, {
    params: {
      prompt,
      url: imageUrl || ""
    }
  });

  return data;
};

const getRepliedImage = async (mid, pageAccessToken) => {
  const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
    params: { access_token: pageAccessToken }
  });

  if (data && data.data.length > 0 && data.data[0].image_data) {
    return data.data[0].image_data.url;
  } else {
    return "";
  }
};

const handleChatResponse = async (senderId, input, pageAccessToken) => {
  const apiUrl = "https://appjonellccapis.zapto.org/api/gpt4o-v2";

  try {
    const { data } = await axios.get(apiUrl, { params: { prompt: input } });
    const result = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟐 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${input}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${result}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
  } catch (error) {
    console.error('Error while processing AI response:', error.message);
    await sendError(senderId, '❌ Ahh sh1t error again.', pageAccessToken);
  }
};

const sendConcatenatedMessage = async (senderId, text, pageAccessToken) => {
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
};

const splitMessageIntoChunks = (message, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendError = async (senderId, errorMessage, pageAccessToken) => {
  const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟐 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
