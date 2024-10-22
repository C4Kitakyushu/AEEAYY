const { TempMail } = require("1secmail-api"); // Restoring TempMail import

// Helper function to generate a random email ID
function generateRandomId() {
  var length = 6;
  var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var randomId = '';

  for (var i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return randomId;
}

module.exports = {
  name: '1secmail',
  description: 'automatically send code.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const command = args[0]; // Using for future command variations

    const reply = (msg) => sendMessage(senderId, { text: msg }, pageAccessToken);

    try {
      // Generate temporary email using TempMail class
      const mail = new TempMail(generateRandomId());

      // Auto-fetch email inbox
      const autoFetch = async () => {
        try {
          const mails = await mail.getMail();

          if (!mails || mails.length === 0) {
            return;
          }

          // Process first email
          const firstMail = mails[0];
          const messageDetails = `📬 You have a message!\n\nFrom: ${firstMail.from}\n\nSubject: ${firstMail.subject}\n\nMessage: ${firstMail.textBody}\nDate: ${firstMail.date}`;
          reply(`${messageDetails}\n\nOnce the email is received, it will be automatically deleted.`);

          // Delete the email after reading it
          await mail.deleteMail(firstMail.id);
        } catch (err) {
          console.error('Error fetching emails:', err);
        }
      };

      // Send initial email creation response
      reply(`✉️ your generated email: ${mail.address}`);

      // Immediately fetch and auto-fetch every 3 seconds
      autoFetch();
      setInterval(autoFetch, 3000); // 3 seconds interval for checking inbox

    } catch (err) {
      console.error('Error:', err);
      reply('An error occurred while generating the temporary email or fetching inbox.');
    }
  }
};
