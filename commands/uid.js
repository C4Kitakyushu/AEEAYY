const axios = require('axios');

module.exports = {
  name: 'getlink',
  description: 'retrieve media link from replied image or video',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage, event, api, getText) {
    const { messageReply } = event;

    // Check if the message is a reply with an image or video attachment
    if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length !== 1) {
      return sendMessage(senderId, { text: getText("invalidFormat") }, pageAccessToken);
    }

    // Send the media URL from the message reply
    try {
      const mediaUrl = messageReply.attachments[0].url;
      sendMessage(senderId, { text: mediaUrl }, pageAccessToken);
    } catch (error) {
      console.error('Error retrieving media URL:', error);
      sendMessage(senderId, { text: 'Failed to retrieve media link.' }, pageAccessToken);
    }
  }
};
