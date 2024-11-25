// WHAT IS TEMPMAIL?

//• Temp mail, or disposable email services, are primarily used for several purposes:

//1. **Privacy Protection**: Users can sign up for online services without revealing their personal email addresses, helping to maintain privacy and reduce spam.

//2. **Temporary Registrations**: Ideal for one-time registrations on websites, allowing users to access content or services without the need for a permanent email address.

//3. **Spam Reduction**: By using a temporary email, users can avoid unwanted promotional emails and advertisements that clutter their inboxes.

//4. **Testing and Development**: Developers can use temp mail for testing email functionalities in applications without using their actual email accounts.

//5. **Avoiding Phishing**: Temporary emails can help users avoid phishing attempts by not exposing their real email addresses to potentially malicious sites.

//6. **Anonymous Communication**: Users can communicate without revealing their identity, which is useful in forums or when providing feedback.

//7. **Account Verification**: Many services require email verification; temp mail allows users to bypass this requirement without compromising their primary email.

//8. **Short-term Projects**: For projects that require email communication but are not long-term, temp mail provides a convenient solution.

//9. **Avoiding Data Tracking**: Using a disposable email can help prevent companies from tracking user behavior through their email addresses.

//10. **Convenience**: It offers a quick and easy way to create an email address for immediate use without the hassle of setting up a new account.


const axios = require('axios');

const HIDE = "https://betadash-uploader.vercel.app/tempmail/gen";
const RANKEDMATCHES = "https://xapiz.onrender.com/tempmail/inbox?email=";

module.exports = {
  name: 'test',
  description: 'generate temporary email or check inbox',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    try {
      if (args.length === 0) {
        return sendMessage(senderId, { text: "tempmail gen and tempmail inbox <email>" }, pageAccessToken);
      }

   const command = args[0].toLowerCase();

      if (command === 'gen') {
        let email;
        try {
          // Generate a random temporary email
          const response = await axios.get(HIDE);
          email = response.data.email;

          if (!email) {
            throw new Error("Failed to generate email");
          }
        } catch (error) {
          console.error("❌ | Failed to generate email", error.message);
          return sendMessage(senderId, { text: `❌ | Failed to generate email. Error: ${error.message}` }, pageAccessToken);
        }
        return sendMessage(senderId, { text: `generated email ✉️: ${email}\n\nDATE: ${date}` }, pageAccessToken);
      } else if (command === 'inbox' && args.length === 2) {
        const email = args[1];
        if (!email) {
          return sendMessage(senderId, { text: "❌ | Please provide an email address to check the inbox." }, pageAccessToken);
        }

        let inboxMessages;
        try {
          // Retrieve messages from the specified email
          const inboxResponse = await axios.get(`${RANKEDMATCHES}${email}`);
          inboxMessages = inboxResponse.data;

          if (!Array.isArray(inboxMessages)) {
            throw new Error("Unexpected response format");
          }
        } catch (error) {
          console.error(`❌ | Failed to retrieve inbox messages`, error.message);
          return sendMessage(senderId, { text: `❌ | Failed to retrieve inbox messages. Error: ${error.message}` }, pageAccessToken);
        }

        if (inboxMessages.length === 0) {
          return sendMessage(senderId, { text: "❌ | No messages found in the inbox." }, pageAccessToken);
        }

        // Get the most recent message
        const latestMessage = inboxMessages[0];
        const from = latestMessage.from || "Unknown sender";
        const date = latestMessage.date || "Unknown date";
        const subject = latestMessage.subject || "No subject";

        const formattedMessage = `📧 From: ${from}\n📩 Subject: ${subject}\n📅 Date: ${date}\n━━━━━━━━━━━━━━━━`;
        return sendMessage(senderId, { text: `INBOX MAIL CHECKER
━━━━━━━━━━━━━━━━\n📬 Inbox messages for ${email}:\n${formattedMessage}` }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `❌ | Invalid command. Use 'tempmail gen (generate email)\ntempmail inbox <email>. (to inbox code)` }, pageAccessToken);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return sendMessage(senderId, { text: `❌ | An unexpected error occurred: ${error.message}` }, pageAccessToken);
    }
  }
};
