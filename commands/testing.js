const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Automatically create a Facebook account.',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    await sendMessage(senderId, {
      text: '⌛ 𝗖𝗿𝗲𝗮𝘁𝗶𝗻𝗴 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗮𝗰𝗰𝗼𝘂𝗻𝘁, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...'
    }, pageAccessToken);

    try {
      const response = await axios.get(`https://ccprojectapis.ddns.net/api/fbcreate`);
      const account = response?.data;

      if (!account || !account.email || !account.password) {
        return sendMessage(senderId, {
          text: '❌ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗰𝗿𝗲𝗮𝘁𝗲 𝗮𝗻 𝗮𝗰𝗰𝗼𝘂𝗻𝘁. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
        }, pageAccessToken);
      }

      const email = account.email;
      const password = account.password;

      await sendMessage(senderId, {
        text: `✔️ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗔𝗰𝗰𝗼𝘂𝗻𝘁 𝗖𝗿𝗲𝗮𝘁𝗲𝗱:\n\n📧 𝗘𝗺𝗮𝗶𝗹: ${email}\n🔑 𝗣𝗮𝘀𝘀𝘄𝗼𝗿𝗱: ${password}\n\n𝗬𝗼𝘂 𝗰𝗮𝗻 𝗻𝗼𝘄 𝘂𝘀𝗲 𝗶𝘁 𝗳𝗼𝗿 𝗮𝗻𝘆 𝗽𝘂𝗿𝗽𝗼𝘀𝗲!`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error creating Facebook account:', error);

      const errorMessage = error.response?.data?.message || '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗰𝗿𝗲𝗮𝘁𝗶𝗻𝗴 𝘁𝗵𝗲 𝗮𝗰𝗰𝗼𝘂𝗻𝘁. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.';
      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
    }
  }
};