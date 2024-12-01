const axios = require('axios');

module.exports = {
  name: 'appstate',
  description: 'Retrieve FB Appstate using email/number and password.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const email = args[0];
    const password = args[1];

    if (!email || !password) {
      return sendMessage(senderId, { 
        text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝗳𝗯𝗮𝗽𝗽𝘀𝘁𝗮𝘁𝗲 <𝗲𝗺𝗮𝗶𝗹/𝗻𝘂𝗺𝗯𝗲𝗿> <𝗽𝗮𝘀𝘀𝘄𝗼𝗿𝗱>' 
      }, pageAccessToken);
    }

    sendMessage(senderId, { 
      text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' 
    }, pageAccessToken);

    try {
      const response = await axios.get('https://ccprojectapis.ddns.net/api/appstate', {
        params: {
          e: email,
          p: password
        }
      });

      const responseData = response.data;

      const responseTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        hour12: true
      });

      if (responseData) {
        sendMessage(senderId, {
          text: `✅ 𝗙𝗕 𝗔𝗣𝗣𝗦𝗧𝗔𝗧𝗘 𝗥𝗲𝘁𝗿𝗶𝗲𝘃𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆:\n\n📜 𝗔𝗽𝗽𝘀𝘁𝗮𝘁𝗲: ${JSON.stringify(responseData, null, 2)}\n\n⏰ 𝗔𝘀𝗶𝗮/𝗠𝗮𝗻𝗶𝗹𝗮: ${responseTime}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, {
          text: '❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝗔𝗽𝗽𝘀𝘁𝗮𝘁𝗲.'
        }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { 
        text: '❌ 𝗘𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝗱𝘂𝗿𝗶𝗻𝗴 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.' 
      }, pageAccessToken);
    }
  }
};
