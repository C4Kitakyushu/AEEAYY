const axios = require('axios');

module.exports = {
  name: 'mailbox',
  description: 'mailbox <email>.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      const email = args[0];
      if (!email) {
        return sendMessage(senderId, { text: "🚫Please provide an email address to check." }, pageAccessToken);
      }

      const apiUrl = `https://markdevs-last-api.onrender.com/api/getmessage/${email}`;
      const response = await axios.get(apiUrl);

      if (response.data.error) {
        return sendMessage(senderId, { text: `Error: ${response.data.error}` }, pageAccessToken);
      }

      const messages = response.data.messages || [];
      if (messages.length === 0) {
        return sendMessage(senderId, { text: "🚫 No messages found for the provided email address." }, pageAccessToken);
      }

      let messageContent = `Messages for ${email}:\n\n`;
      messages.forEach((msg, index) => {
        messageContent += `Message ${index + 1}:\nFrom: ${msg.from}\nSubject: ${msg.subject}\nBody: ${msg.body}\n\n`;
      });

      sendMessage(senderId, { text: messageContent }, pageAccessToken);

    } catch (error) {
       console.error('Error:', error);
      sendMessage(senderId, { text: "An error occurred while checking the email inbox." }, pageAccessToken);
    }
  }
};
