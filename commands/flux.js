const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'flux',
  description: 'example: flux dog',
  usage: 'flux <prompt>\nExample: flux dog',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, {
        text: '🚫 Please provide a prompt to generate an image.'
      }, pageAccessToken);
      return;
    }

    const prompt = args.join(' ');
    const apiUrl = `https://nethwieginedev.vercel.app/flux?q=${encodeURIComponent(prompt)}`;

    await sendMessage(senderId, { text: 'Generating photo based on your prompt.' }, pageAccessToken);

    try {
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: apiUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error('❌ Error generating image:', error);
      await sendMessage(senderId, {
        text: '❌😭An error occurred while generating the image. Please try again later.'
      }, pageAccessToken);
    }
  }
};