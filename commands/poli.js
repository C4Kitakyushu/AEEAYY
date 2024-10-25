const axios = require('axios');
const fs = require('fs-extra');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'poli',
  description: 'generate image from Pollinations AI based on prompt',
  author: 'Developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide a prompt for image generation.' }, pageAccessToken);
      return;
    }

    const query = args.join(" ");
    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const path = `${__dirname}/cache/${timestamp}_tid.png`;

    try {
      await sendMessage(senderId, { text: `Searching for ${query}` }, pageAccessToken);

      const poli = (await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
        responseType: 'arraybuffer',
      })).data;
      
      fs.writeFileSync(path, Buffer.from(poli, 'utf-8'));

      setTimeout(async () => {
        await sendMessage(senderId, { 
          attachment: { type: 'image', payload: { url: `file://${path}` } } 
        }, pageAccessToken);

        fs.unlinkSync(path);
      }, 5000);

    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
    }
  }
};
