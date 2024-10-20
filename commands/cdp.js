const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');
const fs = require('fs');

const token = fs.readFileSync('token.txt', 'utf8');

module.exports = {
  name: 'cdp',
  description: 'Fetch couple DP images',
  author: 'developer',
  usage: 'cdp',

  async execute(senderId) {
    const pageAccessToken = token;

    try {
      // Make the API call to get the couple DP data
      const { data } = await axios.get("https://apizaryan.onrender.com/v1/cdp/get");

      // Fetch male image
      const maleImg = await axios.get(data.male, { responseType: 'arraybuffer' });
      fs.writeFileSync(__dirname + '/tmp/img1.png', Buffer.from(maleImg.data, 'utf-8'));

      // Fetch female image
      const femaleImg = await axios.get(data.female, { responseType: 'arraybuffer' });
      fs.writeFileSync(__dirname + '/tmp/img2.png', Buffer.from(femaleImg.data, 'utf-8'));

      // Send message with both images
      const msg = 'Here is your couple dp 💜(◕ᴗ◕✿)';
      const allImages = [
        fs.createReadStream(__dirname + '/tmp/img1.png'),
        fs.createReadStream(__dirname + '/tmp/img2.png')
      ];

      await sendMessage(senderId, { text: msg, attachment: allImages }, pageAccessToken);
    } catch (error) {
      console.error('Error fetching couple DP:', error.message, error.stack);  // More detailed error message

      // Send a user-friendly error message
      await sendMessage(senderId, { text: `Error: Unable to fetch couple DP. Reason: ${error.message}` }, pageAccessToken);
    }
  },
};
