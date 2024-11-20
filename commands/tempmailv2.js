const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const domains = ["1secmail.com", "1secmail.org", "1secmail.net"];

module.exports = {
  name: 'tempmailv2',
  description: 'Generates a temporary email and checks its inbox.',
  usage: 'tempmail create or tempmail inbox <email>',
  author: 'Akimitsu',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email] = args;

    // Command to generate a temporary email
    if (cmd === 'gen') {
      try {
        const response = await axios.get('https://mekumi-rest-api.onrender.com/api/tempmail-create');
        const emailData = response.data;

        if (emailData && emailData.email) {
          sendMessage(senderId, { text: `✨ Temporary email generated: ${emailData.email}` }, pageAccessToken);
        } else {
          sendMessage(senderId, { text: 'Failed to generate temporary email.' }, pageAccessToken);
        }
      } catch (error) {
        sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
      }
    }

    // Command to check inbox for a temporary email
    if (cmd === 'inbox' && email && domains.some(d => email.endsWith(`@${d}`))) {
      try {
        const response = await axios.get(`https://mekumi-rest-api.onrender.com/api/tempmail-inbox?email=${email}`);
        const inboxData = response.data;

        if (inboxData && inboxData.messages && inboxData.messages.length > 0) {
          const { from, subject, date, id } = inboxData.messages[0];
          const messageResponse = await axios.get(`https://mekumi-rest-api.onrender.com/api/tempmail-inbox?email=${email}&id=${id}`);
          const messageData = messageResponse.data;

          sendMessage(senderId, {
            text: `📬 | Latest Email:\nFrom: ${from}\nSubject: ${subject}\nDate: ${date}\n\nContent:\n${messageData.textBody}`
          }, pageAccessToken);
        } else {
          sendMessage(senderId, { text: 'Inbox is empty.' }, pageAccessToken);
        }
      } catch (error) {
        sendMessage(senderId, { text: `Error: ${error.message}` }, pageAccessToken);
      }
    } else {
      sendMessage(senderId, { text: 'Invalid usage. Use tempmail create or tempmail inbox <email>' }, pageAccessToken);
    }
  },
};
