module.exports = {
  name: 'getlink',
  description: 'Retrieve the URL of an image or video attachment.',
  author: 'AceGun',

  async execute(senderId, args, pageAccessToken, event) {
    const { messageReply } = event;

    if (
      event.type !== 'message_reply' ||
      !messageReply.attachments ||
      messageReply.attachments.length !== 1
    ) {
      return sendMessage(senderId, {
        text: 'Invalid format. Please reply to a message containing a single image or video.'
      }, pageAccessToken);
    }

    const attachmentUrl = messageReply.attachments[0].url;

    try {
      await sendMessage(senderId, {
        text: `Here is the link to the attachment: \n\n🔗 ${attachmentUrl}`
      }, pageAccessToken);
    } catch (error) {
      console.error('❌ Error sending the attachment link:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: '❌ An error occurred while retrieving the attachment link. Please try again later.'
      }, pageAccessToken);
    }
  }
};
