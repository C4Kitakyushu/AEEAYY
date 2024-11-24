const axios = require('axios');

module.exports = {
  name: 'agecalculate',
  description: 'agecalculate <year> <month> <date> - Calculate age based on given date.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const year = args[0];
    const month = args[1];
    const date = args[2];

    if (!year || !month || !date) {
      return sendMessage(senderId, { text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝗮𝗴𝗲𝗰𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗲 <𝘆𝗲𝗮𝗿> <𝘮𝗼𝗻𝘁𝗵> <𝘥𝗮𝘁𝗲>' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/age-calculate?year=${year}&month=${month}&date=${date}`);

      const { success, message, data } = response.data;

      if (success) {
        const { age, nextBirthday } = data;
        sendMessage(senderId, {
          text: `🎉 𝗔𝗴𝗲 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗶𝗼𝗻 ✅:\n\n` +
                `📅 𝗗𝗮𝘁𝗲 𝗼𝗳 𝗕𝗶𝗿𝘁𝗵: ${year}-${month}-${date}\n` +
                `🎂 𝗔𝗴𝗲: ${age}\n` +
                `🎉 𝗡𝗲𝘅𝘁 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${nextBirthday}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { text: `❌ 𝗘𝗿𝗿𝗼𝗿: ${message}` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗰𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗲 𝗮𝗴𝗲.' }, pageAccessToken);
    }
  }
};
