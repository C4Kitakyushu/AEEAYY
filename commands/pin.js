const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  name: "pinterest",
  description: "image search",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const keySearch = args.join(" ");

    if (!keySearch.includes("-")) {
      return sendMessage(senderId, { text: 'Please enter in the format, example: pinterest Coco Martin - 10 (20 limit only)' }, pageAccessToken);
    }

    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'));
    const numberSearch = keySearch.split("-").pop() || 6;

    try {
      const res = await axios.get(`https://gpt4withcustommodel.onrender.com/api/pin?title=${encodeURIComponent(keySearchs)}&count=20`);
      const data = res.data.data;
      const imgData = [];

      for (let i = 0; i < parseInt(numberSearch); i++) {
        let num = i + 1;
        let path = __dirname + `/cache/${num}.jpg`;
        let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
        fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
        imgData.push(fs.createReadStream(path));
      }

      sendMessage(senderId, {
        attachment: imgData,
        body: `${numberSearch} Search results for keyword: ${keySearchs}`
      }, pageAccessToken);

      for (let ii = 1; ii <= parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
      }
    } catch (error) {
      console.error("Error during Pinterest image search:", error);
      sendMessage(senderId, { text: "An error occurred while fetching the data." }, pageAccessToken);
    }
  }
};
