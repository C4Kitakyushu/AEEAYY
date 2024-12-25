const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'test',
  description: 'fbcover <name> <id> <subname> <colorname> <colorsub>',
  usage: 'fbcover <name> <id> <subname> <colorname> <colorsub>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 5) {
      await sendMessage(senderId, { text: '❌ Please provide five parameters: name, id, subname, colorname, and colorsub.' }, pageAccessToken);
      return;
    }

    const [name, id, subname, colorname, colorsub] = args;
    const apiUrl = `https://api.joshweb.click/canvas/fbcoverv4?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&colorname=${encodeURIComponent(colorname)}&colorsub=${encodeURIComponent(colorsub)}`;

    try {
      await sendMessage(senderId, { 
        attachment: { 
          type: 'image', 
          payload: { url: apiUrl } 
        } 
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: 'Error: Could not generate Facebook cover image.' }, pageAccessToken);
    }
  }
};