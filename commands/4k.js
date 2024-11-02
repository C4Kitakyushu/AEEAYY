const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const baseURL = 'https://c-v5.onrender.com';
const endpoints = {
  upscale: '/upscale',
  usage: '/api/usage'
};

module.exports = {
  name: '4k',
  description: 'Upscale your image.',
  author: 'Rosmar aw aw',

  async execute(senderId, args, pageAccessToken, imageUrl, isReply = false, event) {
    if (!imageUrl && !isReply) {
      return sendMessage(senderId, {
        text: "Please reply to an image or provide a valid image URL."
      }, pageAccessToken);
    }

    let finalImageUrl = imageUrl;

    try {
      if (isReply && event.type === "message_reply") {
        const replyAttachment = event.messageReply.attachments[0];
        if (["photo", "sticker"].includes(replyAttachment?.type)) {
          finalImageUrl = replyAttachment.url;
        } else {
          return sendMessage(senderId, { text: "Please reply to an image." }, pageAccessToken);
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
        finalImageUrl = args[0];
      }

      await sendMessage(senderId, { text: '🔎| Processing your request, please wait...' }, pageAccessToken);

      const upscaleUrl = `${baseURL}${endpoints.upscale}?url=${encodeURIComponent(finalImageUrl)}&upscale_factor=8&format=PNG`;
      const upscaleResponse = await axios.get(upscaleUrl);

      if (upscaleResponse.data?.status === "success" && upscaleResponse.data.data?.url) {
        const resultUrl = upscaleResponse.data.data.url;

        const usageResponse = await axios.get(`${baseURL}${endpoints.usage}`);
        if (!usageResponse.data || !usageResponse.data.totalRequests) {
          throw new Error("Invalid response format from usage API");
        }

        await sendMessage(senderId, {
          text: `📦| Model: UPSCALE\n🔮| Total Requests: ${usageResponse.data.totalRequests}`,
          attachment: { type: 'image', payload: { url: resultUrl } }
        }, pageAccessToken);

      } else {
        throw new Error("Upscale API returned an invalid response structure.");
      }

    } catch (error) {
      console.error('Error upscaling image:', error);
      await sendMessage(senderId, {
        text: `Error: ${error.message || "Invalid response from API."}`
      }, pageAccessToken);
    }
  }
};
