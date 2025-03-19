const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { sendMessage } = require('./sendMessage');

const commands = new Map();
const lastImageByUser = new Map();
const lastVideoByUser = new Map();
const prefix = '-';

// Load commands dynamically
const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.name.toLowerCase(), command);
}

async function handleMessage(event, pageAccessToken) {
  if (!event || !event.sender || !event.sender.id) {
    console.error('Invalid event object');
    return;
  }

  const senderId = event.sender.id;

  if (event.message && event.message.attachments) {
    const imageAttachment = event.message.attachments.find(att => att.type === 'image');
    const videoAttachment = event.message.attachments.find(att => att.type === 'video');

    if (imageAttachment) {
      lastImageByUser.set(senderId, imageAttachment.payload.url);
    }
    if (videoAttachment) {
      lastVideoByUser.set(senderId, videoAttachment.payload.url);
    }
  }

  if (event.message && event.message.text) {
    const messageText = event.message.text.trim().toLowerCase();

    // Handling "gemini" command
    if (messageText.startsWith('ai')) {
      const lastImage = lastImageByUser.get(senderId);
      const args = messageText.split(/\s+/).slice(1);

      try {
        await commands.get('ai').execute(senderId, args, pageAccessToken, event, lastImage);
        lastImageByUser.delete(senderId);
      } catch (error) {
        console.error('Error while processing the Gemini command:', error);
        await sendMessage(
          senderId,
          { text: '❌ An error occurred while processing your Gemini request. Please try again later.' },
          pageAccessToken
        );
      }
      return;
    }

    // Handling "removebg" command
    if (messageText === 'removebg') {
      const lastImage = lastImageByUser.get(senderId);
      if (lastImage) {
        try {
          await commands.get('removebg').execute(senderId, [], pageAccessToken, lastImage);
          lastImageByUser.delete(senderId);
        } catch (error) {
          await sendMessage(senderId, { text: '❌ An error occurred while processing the image.' }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: '❌ Please send an image first, then type "removebg" to remove its background.' }, pageAccessToken);
      }
      return;
    }

    // Handling "imgur" command
    if (messageText === 'imgur') {
      const mediaToUpload = lastImageByUser.get(senderId) || lastVideoByUser.get(senderId);

      if (mediaToUpload) {
        try {
          await commands.get('imgur').execute(senderId, [], pageAccessToken, mediaToUpload);
          lastImageByUser.delete(senderId);
          lastVideoByUser.delete(senderId);
        } catch (error) {
          await sendMessage(senderId, { text: '🫵😼' }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: '❌ Please send an image or video first, then type "imgur" to upload.' }, pageAccessToken);
      }
      return;
    }

    // Handling "gdrive" command
    if (messageText === 'gdrive') {
      const mediaToUpload = lastImageByUser.get(senderId) || lastVideoByUser.get(senderId);

      if (mediaToUpload) {
        try {
          await commands.get('gdrive').execute(senderId, [], pageAccessToken, mediaToUpload);
          lastImageByUser.delete(senderId);
          lastVideoByUser.delete(senderId);
        } catch (error) {
          await sendMessage(senderId, { text: '🫵😼' }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: '❌ Please send an image or video first, then type "gdrive" to upload.' }, pageAccessToken);
      }
      return;
    }

    // Generic Command Handling (Prefix & Non-Prefix)
    let commandName, args;
    if (messageText.startsWith(prefix)) {
      const argsArray = messageText.slice(prefix.length).split(' ');
      commandName = argsArray.shift().toLowerCase();
      args = argsArray;
    } else {
      const words = messageText.split(' ');
      commandName = words.shift().toLowerCase();
      args = words;
    }

    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      try {
        await command.execute(senderId, args, pageAccessToken, sendMessage);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await sendMessage(senderId, { text: `❌ Error executing command "${commandName}". Please try again later.` }, pageAccessToken);
      }
      return;
    }

    // Default to AI Command if no other command matches
    const aiCommand = commands.get('ai');
    if (aiCommand) {
      try {
        await aiCommand.execute(senderId, [messageText], pageAccessToken);
      } catch (error) {
        console.error('Error executing AI command:', error);
        await sendMessage(senderId, { text: '❌ There was an error processing your request.' }, pageAccessToken);
      }
    }
  } else if (event.message) {
    console.log('Received message without text');
  } else {
    console.log('Received event without message');
  }
}

module.exports = { handleMessage };