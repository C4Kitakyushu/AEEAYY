const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'pastecode',
  description: 'upload code snippets to pastecode and send the link.',
  author: 'Romeo & Juliet kantotan',  // if you change credit you are a gay

  async execute(senderId, args, pageAccessToken, sendMessage, event, api) {
    try {
      if (event.type === "message_reply") {
        // Handling code from replied message
        const code = event.messageReply.body;
        
        // Upload to paste.c-net.org
        const response = await axios.post('https://paste.c-net.org/', code, {
          headers: {
            'X-FileName': 'replied-code.txt'
          }
        });

        // Construct the paste URL
        const pasteUrl = `${response.data}`;
        sendMessage(senderId, { text: `Code uploaded to: ${pasteUrl}` }, pageAccessToken);

      } else {
        // Handling file upload
        if (!args.length) {
          return sendMessage(senderId, { text: 'Please provide a filename!' }, pageAccessToken);
        }

        const fileName = args[0];
        const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
        const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

        if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
          return sendMessage(senderId, { text: 'File not found!' }, pageAccessToken);
        }

        const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

        // Get the code from the file
        const code = await fs.promises.readFile(filePath, "utf-8");

        // Upload to paste.c-net.org
        const response = await axios.post('https://paste.c-net.org/', code, {
          headers: {
            'X-FileName': path.basename(filePath)
          }
        });

        // Construct the paste URL
        const pasteUrl = `${response.data}`;
        sendMessage(senderId, { text: `File uploaded to: ${pasteUrl}` }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error occurred:', error);
      sendMessage(senderId, { text: 'An error occurred while uploading the file or code!' }, pageAccessToken);
    }
  },

  async pasteget(senderId, args, pageAccessToken, sendMessage, api) {
    const url = 'https://paste.c-net.org/';

    if (args.length) {
      for (const arg of args) {
        try {
          const response = await axios.get(`${url}${arg}`);
          sendMessage(senderId, { text: `Retrieved content from ${url}${arg}:\n\n${response.data}` }, pageAccessToken);
        } catch (error) {
          console.error(`Error retrieving from ${url}${arg}:`, error);
          sendMessage(senderId, { text: `An error occurred while retrieving ${url}${arg}` }, pageAccessToken);
        }
      }
    } else {
      sendMessage(senderId, { text: 'Please provide the paste IDs to retrieve!' }, pageAccessToken);
    }
  }
};