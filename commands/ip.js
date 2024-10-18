module.exports = {
  name: 'unsend',
  description: "unsend bot's message",
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage, api, event) {
    // Ensure the command is a reply to a bot message
    if (event.messageReply.senderID !== api.getCurrentUserID()) {
      return sendMessage(senderId, { text: "I can't unsend from other message." }, pageAccessToken);
    }

    // Check if the event is a reply
    if (event.type !== "message_reply") {
      return sendMessage(senderId, { text: "Reply to bot message" }, pageAccessToken);
    }

    try {
      // Attempt to unsend the message
      await api.unsendMessage(event.messageReply.messageID);
    } catch (error) {
      console.error('Error unsending message:', error);
      return sendMessage(senderId, { text: "Something went wrong." }, pageAccessToken);
    }
  }
};
