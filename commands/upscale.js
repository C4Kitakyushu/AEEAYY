const axios = require('axios');
const fs = require('fs-extra');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'upscale',
  description: 'Enhance your photo',
  author: 'kim',
  async execute(senderId, args, pageAccessToken) {
    const pathie = __dirname + `/cache/upscaled_image.jpg`; // Changed the filename for clarity
    const photoUrl = args.length > 0 ? args.join(" ") : null;

    if (!photoUrl) {
      await sendMessage(senderId, { text: '📸 Please provide a URL or reply to a photo to enhance.' }, pageAccessToken);
      return;
    }

    try {
      const findingMessage = await sendMessage(senderId, { text: '🕟 | Upscaling Image, Please wait for a moment...' }, pageAccessToken);

      // Call the upscale API
      const response = await axios.get(`https://hiroshi-api.onrender.com/image/upscale?url=${encodeURIComponent(photoUrl)}`);
      const processedImageURL = response.data;

      // Download the processed image
      const img = (await axios.get(processedImageURL, { responseType: "arraybuffer" })).data;

      // Write the image to a file
      fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

      // Send the enhanced image
      await sendMessage(senderId, {
        text: '🔮 Image Successfully Enhanced',
        attachment: { type: 'image', payload: { url: pathie } }
      }, pageAccessToken);

      // Clean up the temporary file
      fs.unlinkSync(pathie);

      // Optionally unsend the finding message if your sendMessage function supports it
      // await unsendMessage(findingMessage.messageID); // Uncomment if you have unsend functionality

    } catch (error) {
      console.error('Error:', error);
      await sendMessage(senderId, { text: `Error processing image: ${error.message}` }, pageAccessToken);
    }
  }
};
