const { sendMessage } = require('../handles/sendMessage');
const axios = require("axios");

module.exports = {
  name: 'tests',
  description: 'fbcover <name> <gender> <birthday> <love> <follower> <location> <hometown>',
  usage: 'fbcover <name> <gender> <birthday> <love> <follower> <location> <hometown>',
  author: 'developer',
  async execute(senderId, args, pageAccessToken) {
    if (!args || !Array.isArray(args) || args.length < 7) {
      await sendMessage(senderId, {
        text: '❌ Please provide all required parameters: name, gender, birthday, love, follower, location, hometown.',
      }, pageAccessToken);
      return;
    }

    const [name, gender, birthday, love, follower, location, hometown] = args;

    // Retain the profile picture URL
    const userProfileUrl = `https://graph.facebook.com/${senderId}/picture?type=large`;

    try {
      // Generate the API URL
      const apiUrl = `https://api.joshweb.click/canvas/fbcoverv7?uid=${senderId}&name=${encodeURIComponent(name)}&gender=${encodeURIComponent(gender)}&birthday=${encodeURIComponent(birthday)}&love=${encodeURIComponent(love)}&follower=${encodeURIComponent(follower)}&location=${encodeURIComponent(location)}&hometown=${encodeURIComponent(hometown)}`;

      // Notify the user that the cover photo is being generated
      await sendMessage(senderId, {
        text: 'Generating Facebook cover photo, please wait...',
      }, pageAccessToken);

      // Send the generated Facebook cover photo
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: { url: apiUrl },
        },
      }, pageAccessToken);
    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, {
        text: 'Error: Could not generate the Facebook cover image.',
      }, pageAccessToken);
    }
  },
};