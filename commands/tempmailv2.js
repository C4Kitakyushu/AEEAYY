const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const domains = ["rteet.com", "dpptd.com", "1secmail.com", "1secmail.org", "1secmail.net"];

module.exports = {
  name: 'tempmailv2',
  description: 'genmail gen (generate email) & genmail inbox <email>',
  usage: 'genmail gen or genmail inbox <email>',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email] = args;
    if (cmd === 'gen') {
      try {
        // Generate a temporary email
        const response = await axios.get('https://mekumi-rest-api.onrender.com/api/tempmail-create?');
        const generatedEmail = response.data?.email;
        if (generatedEmail) {
          return sendMessage(senderId, { text: `✨ Generated email: ${generatedEmail}` }, pageAccessToken);
        }
        return sendMessage(senderId, { text: 'Error: Unable to generate email.' }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Error: Unable to generate email.' }, pageAccessToken);
      }
    }

    if (cmd === 'inbox' && email && domains.some(d => email.endsWith(`@${d}`))) {
      try {
        // Fetch inbox for the provided email
        const inboxResponse = await axios.get(`https://mekumi-rest-api.onrender.com/api/tempmail-inbox?email=${email}`);
        const inbox = inboxResponse.data?.messages || [];

        if (!inbox.length) {
          return sendMessage(senderId, { text: 'Inbox is empty.' }, pageAccessToken);
        }

        // Parse the latest email
        const { from, subject, date, content } = inbox[0];
        return sendMessage(senderId, {
          text: `📬 | Latest Email:\nFrom: ${from}\nSubject: ${subject}\nDate: ${date}\n\nContent:\n${content}`,
        }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Error: Unable to fetch inbox or email content.' }, pageAccessToken);
      }
    }

    sendMessage(senderId, { text: 'Invalid usage. Use genmail gen or genmail inbox <email>' }, pageAccessToken);
  },
};
