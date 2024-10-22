const axios = require('axios');
const fs = require('fs-extra');
const { sendMessage } = require('../handles/sendMessage');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'cdp',
  description: 'fetches a couple display picture (dp).',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    if (args.length > 0) {
      return sendMessage(senderId, { text: "‼️ This command does not require additional arguments." }, pageAccessToken);
    }

    sendMessage(senderId, { text: "⚙ Fetching a couple DP for you..." }, pageAccessToken);

    try {
      // Make the API call to fetch couple DP URLs
      const { data } = await axios.get("https://c-v3.onrender.com/v1/cdp/get");

      // Fetch the images using axios
      const maleImg = await axios.get(data.male, { responseType: 'arraybuffer' });
      fs.writeFileSync(__dirname + '/tmp/img1.png', Buffer.from(maleImg.data, 'utf-8'));

      const femaleImg = await axios.get(data.female, { responseType: 'arraybuffer' });
      fs.writeFileSync(__dirname + '/tmp/img2.png', Buffer.from(femaleImg.data, 'utf-8'));

      // Prepare the message and attachments
      const msg = "Here is your couple DP 💜(◕ᴗ◕✿)";
      const allImages = [
        fs.createReadStream(__dirname + '/tmp/img1.png'),
        fs.createReadStream(__dirname + '/tmp/img2.png')
      ];

      // Send the couple DP images
      sendMessage(senderId, {
        body: msg,
        attachment: allImages
      }, pageAccessToken);

    } catch (error) {
      console.error('Error fetching couple DP:', error);
      sendMessage(senderId, { text: `❌ An error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
