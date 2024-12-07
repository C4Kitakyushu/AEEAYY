const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

const domains = ["rteet.com", "dpptd.com", "1secmail.com", "1secmail.org", "1secmail.net"];

module.exports = {
  name: 'tempmail',
  description: 'tempmail gen (generate email) & tempmail inbox <email>',
  usage: 'genmail gen or genmail inbox <email>',
  author: 'developer',

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email] = args;
    if (cmd === 'gen') {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      return sendMessage(senderId, { text: `✉️ generated email: ${Math.random().toString(36).slice(2, 10)}@${domain}` }, pageAccessToken);
    }

    if (cmd === 'inbox' && email && domains.some(d => email.endsWith(`@${d}`))) {
      try {
        const [username, domain] = email.split('@');
        const inbox = (await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`)).data;
        if (!inbox.length) return sendMessage(senderId, { text: 'Inbox is empty.' }, pageAccessToken);

        const { id, from, subject, date } = inbox[0];
        const { textBody } = (await axios.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${id}`)).data;
        return sendMessage(senderId, { text: `━━━━━━━━━━━━━━━━\n📧 From: ${from}\n📄 Subject: ${subject}\n🗓️ Date: ${date}\n━━━━━━━━━━━━━━━━` }, pageAccessToken);
      } catch {
        return sendMessage(senderId, { text: 'Error: Unable to fetch inbox or email content.' }, pageAccessToken);
      }
    }

    sendMessage(senderId, { text: 'Invalid usage. Use tempmail gen or temmpmail inbox <email>' }, pageAccessToken);
  },
};