module.exports = {
  name: 'uid',
  description: 'get the user’s facebook uid.',
  author: 'developer',
  async execute(senderId, args, pageAccessToken, sendMessage, event) {
    try {
      // If no user is mentioned, send the UID of the sender or the replied message's sender
      if (Object.keys(event.mentions).length === 0) {
        if (event.messageReply) {
          const senderID = event.messageReply.senderID;
          return sendMessage(senderId, { text: senderID }, pageAccessToken);
        } else {
          return sendMessage(senderId, { text: `${event.senderID}` }, pageAccessToken);
        }
      } 
      
      // If users are mentioned, send the UID of each mentioned user
      for (const mentionID in event.mentions) {
        const mentionName = event.mentions[mentionID];
        sendMessage(senderId, { text: `${mentionName.replace('@', '')}: ${mentionID}` }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error processing UID:', error);
      sendMessage(senderId, { text: 'An error occurred while processing the request.' }, pageAccessToken);
    }
  }
};