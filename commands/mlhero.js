const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'mlhero',  // Command name
  description: 'Get info of a hero in Mobile Legends',  // Description of the command
  usage: '<hero name>',  // Usage example
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if hero name argument is provided
    if (!args || args.length === 0) {
      // Send message requesting a hero name if missing
      await sendMessage(senderId, {
        text: 'Please provide a hero name.'
      }, pageAccessToken);
      return;  // Exit the function if no hero name is provided
    }

    // Concatenate arguments to form the hero name
    const heroName = args.join(' ');
    const apiUrl = `https://joshweb.click/api/mlhero?q=${encodeURIComponent(heroName)}`;  // API endpoint with the hero name

    // Notify user that the hero info is being retrieved
    await sendMessage(senderId, { text: 'Fetching hero info... Please wait.' }, pageAccessToken);

    try {
      // Fetch hero information from the API
      const response = await axios.get(apiUrl);
      const heroInfo = response.data.result;

      // Destructure hero details
      const {
        hero_img: img,
        description = "No description",
        role,
        lane,
        speciality = "Not found",
        release_date: date,
        story_info_list: {
          'Full name': fname = "Not found",
          Alias: alias = "Not found",
          Gender: gender = "Not found",
          Species: species = "Not found"
        },
        gameplay_info: {
          difficulty: diff = "Not found",
          durability: dur = "Not found"
        }
      } = heroInfo;

      // Construct the message body with hero details
      const messageText = `•———[ 𝗛𝗘𝗥𝗢 𝗜𝗡𝗙𝗢 ]———•\n\nName: ${fname}\nAlias: ${alias}\nDescription: ${description}\nGender: ${gender}\nSpecies: ${species}\nRole: ${role}\nLane: ${lane}\nSpeciality: ${speciality}\nDurability: ${dur}\nDifficulty: ${diff}/10\nRelease Date: ${date || 'Not found'}\n\n•———[ 𝗛𝗘𝗥𝗢 𝗜𝗡𝗙𝗢 ]———•`;

      // Send the hero info message with image attachment
      await sendMessage(senderId, {
        text: messageText,
        attachment: {
          type: 'image',
          payload: {
            url: img  // URL of the hero's image
          }
        }
      }, pageAccessToken);

    } catch (error) {
      // Handle and log any errors during data retrieval
      console.error('Error fetching hero info:', error);

      // Notify user of the error
      await sendMessage(senderId, {
        text: 'An error occurred while fetching hero info. Please try again later.'
      }, pageAccessToken);
    }
  }
};
