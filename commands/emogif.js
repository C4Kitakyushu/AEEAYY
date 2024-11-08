const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'emigif',  // Command name
  description: 'convert emoji to gif',  // Description
  usage: '[emoji]',  // Usage
  author: 'developer',  // Author of the command

  async execute(senderId, args, pageAccessToken) {
    if (!args || args.length === 0) {
      await sendMessage(senderId, { text: 'Please provide an emoji.' }, pageAccessToken);
      return;
    }

    const emoji = args[0];
    const availableEmojis = "😀😃😄😁😆😅😂🤣😭😉😗😙😚😘🥰😍🤩🥳🙃🙂🥲🥹😊☺️😌😏🤤😋😛😝😜🤪🥴😔🥺😬😑😐😶🤐🤔🤫🫢🤭🥱🤗😱🤨🧐😒🙄😮‍💨😤😠😡🤬😞😓😟😥😢☹️🙁😰😨😧😦😮😯😲😳🤯😖😣😩😫😵🥶🥵🤢🤮😴😪🤧🤒🤕😷🤥😇🤠🤑🤓😎🥸🤡😈👿";

    if (!availableEmojis.includes(emoji)) {
      await sendMessage(senderId, { text: `Sorry, the emoji "${emoji}" is not available.` }, pageAccessToken);
      return;
    }

    const encodedEmoji = encodeURIComponent(emoji);
    const apiUrl = `https://joshweb.click/emoji2gif?q=${encodedEmoji}`;

    await sendMessage(senderId, { text: 'Generating GIF... Please wait.' }, pageAccessToken);

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
      console.error('Error generating GIF:', error);
      await sendMessage(senderId, { text: 'An error occurred while generating the GIF.' }, pageAccessToken);
    }
  }
};
