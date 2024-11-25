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
        return sendMessage(senderId, { text: `generated email ✉️: ${email}` }, pageAccessToken);
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
// TERM AND PRIVACY USING TEMPMAIL

// When using Temp Mail or similar temporary email services, it's important to understand their terms of use and privacy implications. These services provide disposable email addresses that help protect your primary email from spam and maintain anonymity. 

// Typically, the terms of use outline how the service operates, including the temporary nature of the email addresses, data retention policies, and user responsibilities. Here are some key points to consider:

  
//**Legal Considerations**  

// - **Terms of Service (ToS)**: Always review the ToS of the temporary email service. This document outlines the rules for using the service and the consequences of violating them.  
//- **User  Agreements**: Understand the contracts made with the service provider, including any limitations on usage and the potential for account termination if misused.  
// - **Data Retention Policies**: Different services have varying policies on how long they retain emails and user data. Familiarize yourself with these policies to understand what information may be stored or shared.  
// - **Legal Obligations**: Temporary email providers may be required to comply with legal requests from law enforcement, which could include disclosing user information.  

  
// **Privacy Implications**  

- **Anonymity**: While Temp Mail offers a degree of anonymity, it is not completely private. Some data may still be logged, and providers might be compelled to assist authorities if required.  
// - **Personal Information**: Ensure that the service collects minimal personal information. Ideally, the service should not link your temporary email to your IP address or other identifiable data.  
// - **Compliance with Privacy Laws**: Be aware of the privacy laws applicable in your country and the countries of your correspondents, especially if you are in regions like the European Union where regulations like GDPR apply.  

  
// **Best Practices for Use**  

// - **Avoid Sensitive Transactions**: Do not use temporary email for sensitive communications, financial transactions, or anything that requires a permanent email address.  
// - **Clear Browser Data**: Regularly clear your browser's cache and cookies to enhance your privacy while using temporary email services.  
// - **Use Trusted Sources**: Only interact with trusted websites and avoid clicking on suspicious links or attachments received in your temp mail inbox.  
// - **Manage Multiple Accounts**: Temp mail can be useful for creating multiple accounts on platforms without cluttering your primary inbox.  

  
// By understanding the terms and privacy implications of using Temp Mail, you can effectively utilize these services while minimizing legal risks and protecting your personal information.

