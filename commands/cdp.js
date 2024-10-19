const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  name: 'cdp',
  description: 'fetches a couple dp.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙ Fetching a couple dp for you..." }, pageAccessToken);

    try {
      const apiUrl = 'https://c-v3.onrender.com/v1/cdp/get';
      const { data } = await axios.get(apiUrl);

      const maleImg = await axios.get(data.male, { responseType: 'arraybuffer' });
      const femaleImg = await axios.get(data.female, { responseType: 'arraybuffer' });

      const maleImgPath = __dirname + '/tmp/img1.png';
      const femaleImgPath = __dirname + '/tmp/img2.png';

      fs.writeFileSync(maleImgPath, Buffer.from(maleImg.data, 'utf-8'));
      fs.writeFileSync(femaleImgPath, Buffer.from(femaleImg.data, 'utf-8'));

      const allImages = [
        fs.createReadStream(maleImgPath),
        fs.createReadStream(femaleImgPath)
      ];

      const message = "Here is your couple dp 💜(◕ᴗ◕✿)";

      sendMessage(senderId, {
        text: message,
        attachment: allImages
      }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching couple dp:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
