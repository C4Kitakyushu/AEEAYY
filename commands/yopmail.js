const { sendMessage } = require("../handles/sendMessage");
const axios = require('axios');

module.exports = {
  name: "yopmail",
  description: "generate YOPMail email, check inbox, and read messages.",
  usage: "yopmail <gen|inbox|read> [options]",
  author: "Rhy",

  async execute(senderId, args, pageAccessToken) {
    if (args.length === 0) {
      const errorMessage = "❗ Please specify an action. Usage: `yopmail gen`, `yopmail inbox <email>`, `yopmail read <email> <messageId>`.";
      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      return;
    }

    const action = args[0].toLowerCase();

    if (action === "gen") {
      try {
        const response = await axios.get('http://de01-2.uniplex.xyz:6150/create');
        const email = response.data.email;

        const message = `✅ Your YOPMail email address has been created: ${email}\\You can now check your inbox using the 'inbox' command.`;
        await sendMessage(senderId, { text: message }, pageAccessToken);
      } catch (error) {
        console.error("Error generating YOPMail email:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while generating the email. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    }
      
    else if (action === "inbox") {
      if (args.length < 2) {
        const errorMessage = "❗ You need to provide an email. Usage: `yopmail inbox <email>`.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
        return;
      }

      const email = args[1];

      try {
        const response = await axios.get(`http://de01-2.uniplex.xyz:6150/mes?read=${email}`);
        const inbox = response.data.inbox;
        const totalEmails = response.data.totalEmails;

        if (totalEmails === 0) {
          const noMailMessage = "📬 Your inbox is empty.";
          await sendMessage(senderId, { text: noMailMessage }, pageAccessToken);
        } else {
          const mailSummary = inbox.map((mail) => {
            return `📧 ID: ${mail.id}\From: ${mail.from}\Subject: ${mail.subject}\Time: ${mail.timestamp}\`;
          }).join("\");

          const message = `✅ You have ${totalEmails} new email(s) in your inbox:\\${mailSummary}\\Use \yopmail read <messageId>\ to read an email.`;
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } catch (error) {
        console.error("Error fetching YOPMail inbox:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while fetching your inbox. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    }

    else if (action === "read") {
      if (args.length < 3) {
        const errorMessage = "❗ Please provide the email and message ID. Usage: `yopmail read <email> <messageId>`.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
        return;
      }

      const email = args[1];
      const messageId = args[2];

      try {
        const response = await axios.get(`http://de01-2.uniplex.xyz:6150/read?messageId=${email}&token=${messageId}&format=TXT`);
        const emailContent = response.data;

        const message = `✅ Here's the email content:\\From: ${emailContent.from}\Date: ${emailContent.date}\Subject: ${emailContent.submit}\Content:\${emailContent.content}`;
        await sendMessage(senderId, { text: message }, pageAccessToken);
      } catch (error) {
        console.error("Error reading YOPMail message:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while reading the email. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    } else {
      const errorMessage = "❗ Invalid command. Usage: `yopmail gen`, `yopmail inbox <email>`, `yopmail read <email> <messageId>`.";
      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
    }
  }
};