const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');


module.exports = {
  
  name: 'shawty',
  description: 'fetching random shoti',  
  usage: '',  
  author: 'Mettalic Chrome V2', 

  
  async execute(senderId, args, pageAccessToken) {
    // Notify user that the video is being loaded
    await sendMessage(senderId, {
      text: '⌛ Searching shawty please wait..'
    }, pageAccessToken);

    try {
      
      const response = await axios.post("https://shoti-n3lz.onrender.com/api/request/f");
      const data = response.data;

      const videoUrl = data.url;

      
      await sendMessage(senderId, {
        text: `Video Details:\n` +
              `Title: ${data.title}\n` +
              `Username: ${data.username}\n` +
              `Nickname: ${data.nickname}\n` +
              `Total Videos: ${data.totalvids}\n`
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
