if (messageText === 'getlink') {
  const lastImage = lastImageByUser.get(senderId);
  const lastVideo = lastVideoByUser.get(senderId);
  const mediaToRetrieve = lastImage || lastVideo;

  if (mediaToRetrieve) {
    try {
      // Execute the 'getlink' command to retrieve the media link
      await commands.get('getlink').execute(senderId, [], pageAccessToken, {
        messageReply: { attachments: [{ url: mediaToRetrieve }] }
      });

      // Clear the last media references for the user
      lastImageByUser.delete(senderId);
      lastVideoByUser.delete(senderId);
    } catch (error) {
      console.error('Error while retrieving the media link:', error.message);
      await sendMessage(senderId, { text: '🫵😼 Something went wrong. Please try again.' }, pageAccessToken);
    }
  } else {
    // Inform the user to send media before using the 'getlink' command
    await sendMessage(senderId, {
      text: '❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝘀𝗲𝗻𝗱 𝗮𝗻 𝗶𝗺𝗮𝗴𝗲 𝗼𝗿 𝘃𝗶𝗱𝗲𝗼 𝗳𝗶𝗿𝘀𝘁, 𝘁𝗵𝗲𝗻 𝘁𝘆𝗽𝗲 "𝗴𝗲𝘁𝗹𝗶𝗻𝗸" 𝘁𝗼 𝗿𝗲𝘁𝗿𝗶𝗲𝘃𝗲 𝘁𝗵𝗲 𝗹𝗶𝗻𝗸.'
    }, pageAccessToken);
  }
  return;
}

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
