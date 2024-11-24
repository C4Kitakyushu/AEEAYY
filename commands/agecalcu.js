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
      return sendMessage(senderId, { text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝗮𝗴𝗲𝗰𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗲 <𝘆𝗲𝗮𝗿> <𝗺𝗼𝗻𝘁𝗵> <𝗱𝗮𝘁𝗲>' }, pageAccessToken);
    }

    sendMessage(senderId, { text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const response = await axios.get(`https://jerome-web.onrender.com/service/api/age-calculate?year=${year}&month=${month}&date=${date}`);

      // Debugging: Log the full response data to verify its structure
      console.log('API Response:', response.data);

      const { success, message, data } = response.data;

      // Make sure `data` is not undefined and has the expected fields
      if (success && data && data.age !== undefined && data.nextBirthday !== undefined) {
        const { age, nextBirthday } = data;
        sendMessage(senderId, {
          text: `🎉 𝗔𝗴𝗲 𝗖𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗶𝗼𝗻 ✅:\n\n` +
                `📅 𝗗𝗮𝘁𝗲 𝗼𝗳 𝗕𝗶𝗿𝘁𝗵: ${year}-${month}-${date}\n` +
                `🎂 𝗔𝗴𝗲: ${age}\n` +
                `🎉 𝗡𝗲𝘅𝘁 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${nextBirthday}`
        }, pageAccessToken);
      } else if (!success) {
        sendMessage(senderId, { text: `❌ 𝗘𝗿𝗿𝗼𝗿: ${message || 'Unknown error occurred.'}` }, pageAccessToken);
      } else {
        // If the response does not contain the expected data
        sendMessage(senderId, { text: '❌ 𝗘𝗿𝗿𝗼𝗿: 𝗔𝗴𝗲 𝗼𝗿 𝗻𝗲𝘅𝘁 𝗯𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗱𝗮𝘁𝗮 𝗶𝘀 𝗺𝗶𝘀𝘀𝗶𝗻𝗴.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗰𝗮𝗹𝗰𝘂𝗹𝗮𝘁𝗲 𝗮𝗴𝗲.' }, pageAccessToken);
    }
  }
};
