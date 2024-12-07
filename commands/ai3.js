const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'ai3',
  description: 'ask to GPT-4o Pro assistant with image support.',
  author: 'developer',

  async execute(senderId, args) {
    const pageAccessToken = token;

    const input = args.join(" ").trim();
    if (!input) {
      return await sendMessage(senderId, { text: `❌ 𝗣𝗿𝗼𝘃𝗶𝗱𝗲 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗼𝗿 𝗮𝗱𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗨𝗥𝗟.` }, pageAccessToken);
    }

    const [query, imageUrl] = parseInput(input);
    await handleChatResponse(senderId, query, imageUrl, pageAccessToken);
  },
};

const parseInput = (input) => {
  const imageRegex = /imageUrl=(https?:\/\/\S+)/;
  const imageUrlMatch = input.match(imageRegex);

  const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null;
  const query = imageUrl ? input.replace(imageRegex, '').trim() : input;

  return [query, imageUrl];
};

const handleChatResponse = async (senderId, query, imageUrl, pageAccessToken) => {
  const apiUrl = "https://kaiz-apis.gleeze.com/api/gpt-4o-pro";

  try {
    const params = {
      q: query,
      uid: senderId,
      ...(imageUrl && { imageUrl }),
    };

    const { data } = await axios.get(apiUrl, { params });
    const result = data.response;

    const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });
    const formattedResponse = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻: ${query || 'N/A'}\n𝗜𝗺𝗮𝗴𝗲 𝗥𝗲𝗰𝗼𝗴𝗻𝗶𝘁𝗶𝗼𝗻: ${imageUrl || 'N/A'}\n━━━━━━━━━━━━━━━━━━\n𝗔𝗻𝘀𝘄𝗲𝗿: ${result}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

    if (data.imageResponse) {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: { url: data.imageResponse }
        }
      }, pageAccessToken);
    } else {
      await sendConcatenatedMessage(senderId, formattedResponse, pageAccessToken);
    }
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
  const formattedMessage = `𝗠𝗘𝗧𝗔𝗟𝗟𝗜𝗖 𝗖𝗛𝗥𝗢𝗠𝗘 𝗩𝟮 𝗔𝗜 🤖\n━━━━━━━━━━━━━━━━━━\n${errorMessage}\n━━━━━━━━━━━━━━━━━━\n⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝗱 𝗧𝗶𝗺𝗲: ${responseTime}`;

  await sendMessage(senderId, { text: formattedMessage }, pageAccessToken);
};
