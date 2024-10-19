const axios = require('axios');
const fs = require("fs");

module.exports = {
  name: "pinterest", // You can rename this to something else if needed
  description: "search on pinte",
  author: "developer",
  async execute(senderId, args, pageAccessToken, sendMessage) {
    const search = args.join(" ").split(">")[0].trim();
    if (!search) {
      return sendMessage(senderId, {
        text: "🤖 𝙷𝚎𝚕𝚕𝚘 𝚝𝚘 𝚞𝚜𝚎 𝚃𝚑𝚒𝚜 𝙿𝚒𝚗𝚝𝚎𝚛𝚎𝚜𝚝.\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎: 𝙿𝚒𝚗 [ 𝚗𝚊𝚖𝚎 ] - [ 𝚊𝚖𝚘𝚞𝚗𝚝 ] \n\n𝙸𝚏 𝚗𝚘 𝚌𝚘𝚞𝚗𝚝 𝚄𝚜𝚎: 𝙿𝚒𝚗 [ 𝚗𝚊𝚖𝚎 ] 𝚒𝚝 𝚠𝚒𝚕𝚕 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎 5 𝚒𝚖𝚊𝚐𝚎𝚜 𝚠𝚒𝚝𝚑 𝚗𝚘 𝚌𝚘𝚞𝚗𝚝 𝚗𝚎𝚎𝚍𝚎𝚍."
      }, pageAccessToken);
    }

    let count = 5;
    if (args[args.length - 1].includes("-")) {
      count = parseInt(args[args.length - 1].split("-")[1].trim()) || 5;
      args.pop(); // Remove the count from args
    }

    try {
      const response = await axios.get(`https://hiroshi-api.onrender.com/image/pinterest?search=${encodeURIComponent(search)}`);
      const data = response.data;

      if (data.error) {
        return sendMessage(senderId, { text: data.error }, pageAccessToken);
      } else {
        let attachments = [];
        let storedPath = [];

        for (let i = 0; i < Math.min(count, data.length); i++) {
          let path = __dirname + "/cache/" + Math.floor(Math.random() * 99999999) + ".jpg";
          let pic = await axios.get(data[i].url, { responseType: "arraybuffer" });
          fs.writeFileSync(path, pic.data);
          storedPath.push(path);
          attachments.push(fs.createReadStream(path));
        }

        sendMessage({
          body: `🤖 𝐏𝐢𝐧𝐭𝐞𝐫𝐞𝐬𝐭 ( 𝐇𝐢𝐫𝐨𝐬𝐡𝐢 )\n\n🖋️ 𝐒𝐞𝐚𝐫𝐜𝐡: '${search}'\n\n» 𝙽𝚞𝚖𝚋𝚎𝚛: ${attachments.length} «`,
          attachment: attachments
        }, senderId, pageAccessToken);
        
        // Clean up cached files
        for (const item of storedPath) {
          fs.unlinkSync(item);
        }
      }
    } catch (error) {
      console.error('Error fetching data from Pinterest API:', error);
      sendMessage(senderId, { text: "🚫 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚏𝚎𝚝𝚌𝚑𝚒𝚗𝚐 𝚍𝚊𝚝𝚊 𝚏𝚛𝚘𝚖 𝙷𝚒𝚛𝚘𝚜𝚑𝚒 API." }, pageAccessToken);
    }
  }
};
