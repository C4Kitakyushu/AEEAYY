const { sendMessage } = require("../handles/sendMessage");
const axios = require("axios");

module.exports = {
  name: "test",
  description: "Generate YOPMail email, check inbox, and read messages.",
  usage: "yopmail <generate|inbox|read> [options]",
  category: "Tools ⚒️",

  async execute(senderId, args, pageAccessToken) {
    if (args.length === 0) {
      const errorMessage = "❗ Please specify an action. Usage: `yopmail generate`, `yopmail inbox <email>`, `yopmail read <email> <messageId>`.";
      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      return;
    }

    const action = args[0].toLowerCase();

    // Generate Email
    if (action === "generate") {
      try {
        const response = await axios.get("https://elevnnnx-rest-api.onrender.com/api/yopmail?q=create");
        const email = response.data.email;

        const message = `✅ Your YOPMail email address has been created: ${email}\nYou can now check your inbox using the 'inbox' command.`;
        await sendMessage(senderId, { text: message }, pageAccessToken);
      } catch (error) {
        console.error("Error generating YOPMail email:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while generating the email. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    }

    // Inbox Check
    else if (action === "inbox") {
      if (args.length < 2) {
        const errorMessage = "❗ You need to provide an email. Usage: `yopmail inbox <email>`.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
        return;
      }

      const email = args[1];

      try {
        const response = await axios.get(`https://elevnnnx-rest-api.onrender.com/api/yopmail?q=inbox&email=${email}`);
        const inbox = response.data.messages;

        if (!inbox || inbox.length === 0) {
          const noMailMessage = "📭 Your inbox is empty.";
          await sendMessage(senderId, { text: noMailMessage }, pageAccessToken);
        } else {
          const mailSummary = inbox.map((mail) => {
            return `📧 ID: ${mail.id}\n👤 From: ${mail.sender}\n📌 Subject: ${mail.subject}`;
          }).join("\n\n");

          const message = `✅ You have ${inbox.length} email(s) in your inbox:\n\n${mailSummary}\n\nUse \`yopmail read <email> <messageId>\` to read an email.`;
          await sendMessage(senderId, { text: message }, pageAccessToken);
        }
      } catch (error) {
        console.error("Error fetching YOPMail inbox:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while fetching your inbox. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    }

    // Read Email Content
    else if (action === "read") {
      if (args.length < 3) {
        const errorMessage = "❗ Please provide the email and message ID. Usage: `yopmail read <email> <messageId>`.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
        return;
      }

      const email = args[1];
      const messageId = args[2];

      try {
        const response = await axios.get(`https://elevnnnx-rest-api.onrender.com/api/yopmail?q=read&email=${email}&id=${messageId}`);
        const emailContent = response.data;

        const message = `✅ Here's the email content:\n\n📝 ${emailContent.content}`;
        await sendMessage(senderId, { text: message }, pageAccessToken);
      } catch (error) {
        console.error("Error reading YOPMail message:", error);
        const errorMessage = "⚠️ Oops! Something went wrong while reading the email. Please try again later.";
        await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
      }
    } else {
      const errorMessage = "❗ Invalid command. Usage: `yopmail generate`, `yopmail inbox <email>`, `yopmail read <email> <messageId>`.";
      await sendMessage(senderId, { text: errorMessage }, pageAccessToken);
    }
  }
};