const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'Generate a Facebook cover image using the Canvas API.',
  usage: 'fbcover <name> <subname> <sdt> <address> <email> <color>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 6) {
      await sendMessage(senderId, { text: '❌ Please provide all necessary details: name | subname | sdt | address | email | color' }, pageAccessToken);
      return;
    }

    const [name, subname, sdt, address, email, color] = args;
    const apiUrl = `https://api.joshweb.click/canvas/fbcover?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&sdt=${encodeURIComponent(sdt)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&uid=${encodeURIComponent(senderId)}&color=${encodeURIComponent(color)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate the Facebook cover image.' }, pageAccessToken);
    }
  }
};