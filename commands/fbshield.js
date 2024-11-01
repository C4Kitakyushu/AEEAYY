const axios = require('axios');

module.exports = {
  name: 'fbshield',
  description: 'fbshield [ token ] .',
  author: 'developer',

  async execute(senderId, args, pageAccessToken, sendMessage) {
    const userToken = args[0];

    if (!userToken) {
      sendMessage(senderId, { text: '‼️ 𝖯𝖱𝖮𝖵𝖨𝖣𝖤 𝖠 𝖵𝖠𝖫𝖨𝖣 𝖥𝖠𝖢𝖤𝖡𝖮𝖮𝖪 𝖳𝖮𝖪𝖤𝖭.' }, pageAccessToken);
      return;
    }

    try {
      const response = await turnShield(userToken);
      sendMessage(senderId, { text: response }, pageAccessToken);
    } catch (error) {
      console.error(error.message);
      sendMessage(senderId, { text: '𝖥𝖠𝖨𝖫𝖤𝖣 𝖳𝖮 𝖳𝖴𝖱𝖭 𝖮𝖭 𝖯𝖫𝖤𝖠𝖲𝖤 𝖳𝖱𝖸 𝖠𝖦𝖠𝖨𝖭 𝖫𝖠𝖳𝖤𝖱.' }, pageAccessToken);
    }
  }
};

// Helper function to turn on the shield using the new API
async function turnShield(token) {
  const url = `https://betadash-uploader.vercel.app/guard?token=${token}&enable=true`;

  try {
    const response = await axios.get(url);
    if (response.data.success) {
      return '𝖦𝖴𝖠𝖱𝖣 𝖮𝖭 𝖧𝖠𝖲 𝖡𝖤𝖤𝖭 𝖠𝖢𝖳𝖨𝖵𝖠𝖳𝖤𝖣 ✅';
    } else {
      throw new Error('❌ 𝖥𝖠𝖨𝖫𝖤𝖣 𝖳𝖮 𝖳𝖴𝖱𝖭 𝖮𝖭');
    }
  } catch (error) {
    console.error(error);
    throw new Error('❌ 𝖥𝖠𝖨𝖫𝖤𝖣 𝖳𝖮 𝖳𝖴𝖱𝖭 𝖮𝖭 𝖯𝖫𝖤𝖠𝖲𝖤 𝖳𝖱𝖸 𝖠𝖦𝖠𝖨𝖭 𝖫𝖠𝖳𝖤𝖱.');
  }
}
