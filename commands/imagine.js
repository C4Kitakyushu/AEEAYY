const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/sendMessage');

const cacheDir = path.join(__dirname, './cache');

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

async function translateText(text) {
  const translateURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const response = await axios.get(translateURL);
    return response.data[0][0][0];
  } catch (error) {
    console.error('Translation error: ', error.message);
    throw new Error('Error translating text');
  }
}

module.exports = {
  name: 'imagine',
  description: 'generate images from text',
  usage: '[prompt]',
  category: 'Image',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!Array.isArray(args) || args.length === 0) {
      return sendMessage(senderId, { text: 'Please provide something to imagine.' }, pageAccessToken);
    }

    const prompt = args.join(' ');
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const translatedPrompt = await translateText(prompt);

        const response = await axios.post("https://imagine-ayoub.vercel.app/generate-image", { prompt: translatedPrompt });
        const images = response.data.images;

        const cachedImages = [];
        for (let i = 0; i < images.length; i++) {
          const imageBuffer = Buffer.from(images[i], 'binary');
          const filePath = path.join(cacheDir, `cache_${i}.png`);

          // Write image to cache directory
          fs.writeFileSync(filePath, imageBuffer);
          cachedImages.push(filePath);
        }

        const attachments = cachedImages.map(filePath => ({
          type: 'image',
          payload: { url: filePath }
        }));

        return sendMessage(senderId, { text: 'Images generated successfully', attachment: attachments }, pageAccessToken);
      } catch (error) {
        console.error(`Attempt ${attempt + 1} - Error: `, error.response ? JSON.stringify(error.response.data) : error.message);
        attempt++;
        if (attempt >= maxRetries) {
          const errorMessage = error.response && error.response.data && error.response.data.error ? error.response.data.error : error.message;
          sendMessage(senderId, { text: `An error occurred: ${errorMessage}` }, pageAccessToken);
        }
      }
    }
  }
};
