const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Fetch Facebook UID from a given profile link.',
  author: 'Developer',

  async execute(senderId, args, pageAccessToken) {
    // Check if the Facebook URL is provided
    if (!args || args.length === 0) {
      return sendMessage(
        senderId,
        { text: '𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗨𝗥𝗟 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝘁𝗵𝗲 𝗨𝗜𝗗.' },
        pageAccessToken
      );
    }

    const facebookUrl = args[0];

    await sendMessage(
      senderId,
      { text: '⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗨𝗜𝗗, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' },
      pageAccessToken
    );

    try {
      const apiUrl = `https://kaiz-apis.gleeze.com/api/fbuid?url=${encodeURIComponent(facebookUrl)}`;
      const response = await axios.get(apiUrl);

      if (response.data && response.data.UID) {
        await sendMessage(
          senderId,
          {
            text: `✔ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗨𝗜𝗗 𝗳𝗼𝗿 𝘁𝗵𝗲 𝗴𝗶𝘃𝗲𝗻 𝗹𝗶𝗻𝗸:\n\n𝗨𝗜𝗗: ${response.data.UID}`,
          },
          pageAccessToken
        );
      } else {
        await sendMessage(
          senderId,
          { text: '⚠ 𝗨𝗻𝗮𝗯𝗹𝗲 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗨𝗜𝗗. 𝗣𝗹𝗲𝗮𝘀𝗲 𝗺𝗮𝗸𝗲 𝘀𝘂𝗿𝗲 𝘁𝗵𝗲 𝗹𝗶𝗻𝗸 𝗶𝘀 𝘃𝗮𝗹𝗶𝗱.' },
          pageAccessToken
        );
      }
    } catch (error) {
      console.error('Error fetching Facebook UID:', error);
      await sendMessage(
        senderId,
        { text: '⚠ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝘄𝗵𝗶𝗹𝗲 𝗳𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗨𝗜𝗗. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻.' },
        pageAccessToken
      );
    }
  },
};