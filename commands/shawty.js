const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');


module.exports = {
  
  name: 'shawty',
  description: 'fetching random shoti',  
  usage: 'gwapo si makoy',  
  author: 'Mettalic Chrome V2', 

  
  async execute(senderId, args, pageAccessToken) {
    // Notify user that the video is being loaded
    await sendMessage(senderId, {
      text: '⌛ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗿𝗮𝗻𝗱𝗼𝗺 𝘀𝗵𝗼𝘁𝗶 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁..'
    }, pageAccessToken);

    try {
      
      const response = await axios.post("https://shoti-n3lz.onrender.com/api/request/f");
      const data = response.data;

      const videoUrl = data.url;

      
      await sendMessage(senderId, {
        text: `𝗩𝗶𝗱𝗲𝗼 𝗗𝗲𝘁𝗮𝗶𝗹𝘀:\n` +
              `𝗧𝗶𝘁𝗹𝗲: ${data.title}\n` +
              `𝗨𝘀𝗲𝗿𝗻𝗮𝗺𝗲: ${data.username}\n` +
              `𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲: ${data.nickname}\n` +
              `𝗧𝗼𝘁𝗮𝗹 𝗩𝗶𝗱𝗲𝗼𝘀: ${data.totalvids}\n`
      }, pageAccessToken);

      
      await sendMessage(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl 
          }
        }
      }, pageAccessToken);
      
    } catch (error) {
      console.error('❌ Error:', error.message);

      // Handle errors and notify the user
      await sendMessage(senderId, {
        text: '❌ There was an error generating the video. Please try again later.'
      }, pageAccessToken);
    }
  }
};
