const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'tes',
  description: 'Generate a Facebook cover image using user details.',
  usage: 'fbcover <name> <lastname> <phone> <country> <email> <color>',
  author: 'KA TIAN JHYY',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 6) {
      await sendMessage(senderId, { 
        text: '❌ Please provide all required details: <name> <lastname> <phone> <country> <email> <color>.' 
      }, pageAccessToken);
      return;
    }

    const [name, lastname, phone, country, email, color] = args;
    const apiUrl = `https:/api.joshweb.click/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(lastname)}&sdt=${encodeURIComponent(phone)}&address=${encodeURIComponent(country)}&email=${encodeURIComponent(email)}&uid=${encodeURIComponent(senderId)}&color=${encodeURIComponent(color)}`;

    try {
      // Send the Facebook cover image as an attachment
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: '❌ Error: Could not generate Facebook cover image.' }, pageAccessToken);
    }
  }
};