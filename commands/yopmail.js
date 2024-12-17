const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: "yopmail",
  description: "Generate YOPMail email, check inbox, and read messages.",
  usage: "yopmail <gen|inbox|read> [options]",
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const [cmd, email, messageId] = args;

    if (cmd === "gen") {
      try {
        const response = await axios.get('http://de01-2.uniplex.xyz:6150/create');
        const generatedEmail = response.data.email;
        await sendMessage(
          senderId,
          { text: `✅ Your YOPMail email address has been created: ${generatedEmail}\nYou can now check your inbox using the 'inbox' command.` },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error generating YOPMail email:", error);
        await sendMessage(
          senderId,
          { text: "⚠️ Oops! Something went wrong while generating the email. Please try again later." },
          pageAccessToken
        );
      }
      return;
    }

    if (cmd === "inbox" && email) {
      try {
        const response = await axios.get(`http://de01-2.uniplex.xyz:6150/mes?read=${email}`);
        const { inbox, totalEmails } = response.data;

        if (totalEmails === 0) {
          await sendMessage(senderId, { text: "📬 Your inbox is empty." }, pageAccessToken);
          return;
        }

        const mailSummary = inbox
          .map((mail) => `📧 ID: ${mail.id}\nFrom: ${mail.from}\nSubject: ${mail.subject}\nTime: ${mail.timestamp}`)
          .join("\n\n");
        await sendMessage(
          senderId,
          { text: `✅ You have ${totalEmails} new email(s) in your inbox:\n\n${mailSummary}\n\nUse 'yopmail read <email> <messageId>' to read an email.` },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error fetching YOPMail inbox:", error);
        await sendMessage(
          senderId,
          { text: "⚠️ Oops! Something went wrong while fetching your inbox. Please try again later." },
          pageAccessToken
        );
      }
      return;
    }

    if (cmd === "read" && email && messageId) {
      try {
        const response = await axios.get(`http://de01-2.uniplex.xyz:6150/read?messageId=${email}&token=${messageId}&format=TXT`);
        const { from, date, submit, content } = response.data;

        await sendMessage(
          senderId,
          {
            text: `✅ Here's the email content:\n\nFrom: ${from}\nDate: ${date}\nSubject: ${submit}\n\nContent:\n${content}`,
          },
          pageAccessToken
        );
      } catch (error) {
        console.error("Error reading YOPMail message:", error);
        await sendMessage(
          senderId,
          { text: "⚠️ Oops! Something went wrong while reading the email. Please try again later." },
          pageAccessToken
        );
      }
      return;
    }

    await sendMessage(
      senderId,
      { text: "❗ Invalid usage. Use 'yopmail gen', 'yopmail inbox <email>', or 'yopmail read <email> <messageId>'." },
      pageAccessToken
    );
  },
};
