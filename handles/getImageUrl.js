const axios = require('axios');

const getImageUrl = async (event, token) => {
  const mid = event?.message?.reply_to?.mid;
  if (!mid) return null;
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: token }
    });
    return data?.data?.[0]?.image_data?.url || null;
  } catch (err) {
    console.error("Image URL fetch error:", err);
    return null;
  }
};
module.exports = {
  name: 'removebg',
  description: 'Description of what this command does.',
  usage: 'rbg',
  author: 'chi',

  async execute(senderId, args, pageAccessToken, event) {
    try {
      // Use getImageUrl to fetch the image URL if needed
      const imageUrl = await getImageUrl(event, pageAccessToken);

      const message = imageUrl 
        ? `Here's the image URL:\n${imageUrl}`
        : 'No image found in the reply or unable to fetch URL.';

      await sendMessage(senderId, { text: message }, pageAccessToken);
    } catch (error) {
      console.error('Error in removebg:', error);
      await sendMessage(senderId, { text: 'Error in processing the command.' }, pageAccessToken);
    }
  },
};


module.exports = { getImageUrl };