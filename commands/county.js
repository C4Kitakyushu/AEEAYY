const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

// Define and export module
module.exports = {
  // Metadata for the command
  name: 'countryinfo',  // Command name
  description: 'het information about a country.',  // Description 
  usage: 'countryinfo {countryName}',  // Usage
  author: 'developer',  // Author of the command

  // Main function that executes the command
  async execute(senderId, args, pageAccessToken) {
    // Check if prompt arguments are provided
    if (!args || args.length === 0) {
      // Send message requesting a prompt if missing
      await sendMessage(senderId, {
        text: 'Please provide a country name to get information.'
      }, pageAccessToken);
      return;  // Exit the function if no prompt is provided
    }

    // Concatenate arguments to form the country name
    const countryName = args.join(' ');
    const countryApiUrl = `https://country-info-eta.vercel.app/kshitiz?name=${encodeURIComponent(countryName)}`;

    try {
      // Fetch country data from API
      const response = await axios.get(countryApiUrl);
      const { name, officialName, capital, region, subregion, population, area, languages, flag, coatOfArms, currency } = response.data;

      // Format the information
      const infoText = `
        Name: ${name}
        Official Name: ${officialName}
        Capital: ${capital}
        Region: ${region}
        Subregion: ${subregion}
        Population: ${population}
        Area: ${area} km²
        Languages: ${languages}
        Currency: ${currency}
      `;

      // Notify user that the country information is being fetched
      await sendMessage(senderId, { text: 'Fetching country information... Please wait.' }, pageAccessToken);

      // Send country information as text
      await sendMessage(senderId, { text: infoText.trim() }, pageAccessToken);

      // Fetch and send flag and coat of arms images
      const images = [flag, coatOfArms];
      for (let i = 0; i < images.length; i++) {
        try {
          const imgResponse = await axios.get(images[i], { responseType: 'arraybuffer' });
          const imgBase64 = Buffer.from(imgResponse.data, 'binary').toString('base64');

          await sendMessage(senderId, {
            attachment: {
              type: 'image',
              payload: {
                is_reusable: true,
                base64: imgBase64
              }
            }
          }, pageAccessToken);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      }

    } catch (error) {
      // Handle errors and notify the user
      console.error('Error fetching country info:', error);
      await sendMessage(senderId, {
        text: 'Sorry, an error occurred while processing your request.'
      }, pageAccessToken);
    }
  }
};
