const { sendMessage } = require('../handles/sendMessage');
const axios = require('axios');

module.exports = {
  name: 'test',
  description: 'Upload an image to Google Drive and return the file link.',
  author: 'dev',

  async execute(senderId, args, pageAccessToken, imageUrl) {
    if (!imageUrl) {
      return sendMessage(senderId, {
        text: `❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗴𝗱𝗿𝗶𝘃𝗲".`
      }, pageAccessToken);
    }

    await sendMessage(senderId, { text: '⌛ 𝗣𝗿𝗼𝗰𝗲𝘀𝘀𝗶𝗻𝗴 𝗶𝗺𝗮𝗴𝗲, 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...' }, pageAccessToken);

    try {
      const apiUrl = `https://ccprojectsapis.zetsu.xyz/api/gdrive?url=${encodeURIComponent(imageUrl)}`;

      // Call the API to upload the image and get the Drive link
      const response = await axios.get(apiUrl);

      if (response.data && response.data.link) {
        // Send the generated Google Drive link to the user
        await sendMessage(senderId, {
          text: `✅ 𝗛𝗲𝗿𝗲 𝗶𝘀 𝘆𝗼𝘂𝗿 𝗚𝗼𝗼𝗴𝗹𝗲 𝗗𝗿𝗶𝘃𝗲 𝗹𝗶𝗻𝗸:\n${response.data.link}`
        }, pageAccessToken);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      console.error('Error processing gdrive command:', error);
      await sendMessage(senderId, {
        text: '❌ 𝗔𝗻 𝗲𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱. 𝗣𝗹𝗲𝗮𝘀𝗲 𝘁𝗿𝘆 𝗮𝗴𝗮𝗶𝗻 𝗹𝗮𝘁𝗲𝗿.'
      }, pageAccessToken);
    }
  }
};