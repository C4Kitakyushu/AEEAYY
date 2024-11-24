const axios = require('axios');

module.exports = {
  name: 'stsbalcheck',
  description: 'stsbalcheck <phoneNumber> - Check the balance info of a phone number.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const phoneNumber = args[0];

    if (!phoneNumber) {
      return sendMessage(senderId, { text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝘀𝘁𝘀𝗯𝗮𝗹𝗰𝗵𝗲𝗰𝗸 𝗽𝗵𝗼𝗻𝗲 𝗻𝘂𝗺𝗯𝗲𝗿' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://api.kenliejugarap.com/stsbalcheck/?number=${phoneNumber}`);

      const {
        status,
        response: responseMessage,
        brand,
        balance,
        points,
        sim_reg_status
      } = response.data;

      if (status) {
        const responseTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour12: true });

        sendMessage(senderId, {
          text: `𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻 ✅:\n\n` +
                `📞 𝗣𝗵𝗼𝗻𝗲 𝗡𝘂𝗺𝗯𝗲𝗿: ${phoneNumber}\n` +
                `🏷️ 𝗕𝗿𝗮𝗻𝗱: ${brand}\n` +
                `💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${balance}\n` +
                `⭐ 𝗣𝗼𝗶𝗻𝘁𝘀: ${points}\n` +
                `📲 𝗦𝗜𝗠 𝗥𝗲𝗴 𝗦𝘁𝗮𝘁𝘂𝘀: ${sim_reg_status ? '✔️ Registered' : '❌ Not Registered'}\n\n` +
                `⏰ 𝗔𝘀𝗶𝗮/𝗠𝗮𝗻𝗶𝗹𝗮: ${responseTime}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.' }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.' }, pageAccessToken);
    }
  }
};
