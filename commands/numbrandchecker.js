const axios = require('axios');

module.exports = {
  name: 'numbrandchecker',
  description: 'numbrandchecker <phoneNumber> - Check the brand info of a phone number.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const phoneNumber = args[0];

    if (!phoneNumber) {
      return sendMessage(senderId, { text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝗻𝘂𝗺𝗯𝗿𝗮𝗻𝗱𝗰𝗵𝗲𝗰𝗸𝗲𝗿 𝗽𝗵𝗼𝗻𝗲 𝗻𝘂𝗺𝗯𝗲𝗿' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://api.kenliejugarap.com/ph-numbrandchecker/?number=${phoneNumber}`);
      
      const { status, response: brandInfo } = response.data;
      const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

      if (status) {
        const { number_prefix, brand_code, brand_name, brand_description } = brandInfo;
        sendMessage(senderId, {
          text: `𝗡𝘂𝗺𝗯𝗲𝗿 𝗕𝗿𝗮𝗻𝗱 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ✅:\n\n` +
                `📞 𝗡𝘂𝗺𝗯𝗲𝗿 𝗣𝗿𝗲𝗳𝗶𝘅: ${number_prefix}\n` +
                `🏷️ 𝗕𝗿𝗮𝗻𝗱 𝗖𝗼𝗱𝗲: ${brand_code}\n` +
                `📡 𝗕𝗿𝗮𝗻𝗱 𝗡𝗮𝗺𝗲: ${brand_name}\n` +
                `📋 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${brand_description}\n\n` +
                `⏰ 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${responseTime}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗯𝗿𝗮𝗻𝗱 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗯𝗿𝗮𝗻𝗱 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }
  }
};
