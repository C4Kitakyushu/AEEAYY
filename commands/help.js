const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'show available commands',
  author: 'Cruizex',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const cmdFolderPath = path.join(__dirname);
    const files = fs.readdirSync(cmdFolderPath);

    if (args[0] && isNaN(args[0])) {
      const commandName = args[0].toLowerCase() + '.js';
      const commandFile = files.find(file => file.toLowerCase() === commandName);

      if (commandFile) {
        const commandModule = require(path.join(cmdFolderPath, commandFile));
        const englishGuide = commandModule.config.guide && commandModule.config.guide.en;

        if (englishGuide) {
          if (typeof englishGuide === 'string') {
            return sendMessage(senderId, { text: `Guide for ${commandFile}:\n${englishGuide.replace(/\{pn\}/g, config.prefix)}` }, pageAccessToken);
          } else if (typeof englishGuide === 'object' && englishGuide.body) {
            return sendMessage(senderId, { text: `Guide for ${commandFile}:\n${englishGuide.body.replace(/\{pn\}/g, config.prefix)}` }, pageAccessToken);
          }
        }

        return sendMessage(senderId, { text: `Guide for ${commandFile}:\nInformation not available.` }, pageAccessToken);
      } else {
        return sendMessage(senderId, { text: `Command "${args[0]}" not found.` }, pageAccessToken);
      }
    }

    const pageSize = 25;
    const pageIndex = args[0] ? parseInt(args[0], 10) : 1;

    if (isNaN(pageIndex) || pageIndex < 1) {
      return sendMessage(senderId, { text: 'Invalid page number.' }, pageAccessToken);
    }

    const startIdx = (pageIndex - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pageFiles = files.filter(file => file.endsWith('.js') && file !== 'help.js').slice(startIdx, endIdx);

    if (pageFiles.length === 0) {
      return sendMessage(senderId, { text: 'No commands to display on this page.' }, pageAccessToken);
    }

    const formattedCommands = pageFiles.map(file => `\u2022 ${path.parse(file).name}`).join('\n');
    const totalPages = Math.ceil((files.length - 1) / pageSize);
    const currentPage = Math.min(Math.ceil(endIdx / pageSize), totalPages);

    let helpMessage = `🪪 : 🤖 𝖠𝖲𝖲𝖨𝖲𝖳𝖠𝖭𝖳 
  🤖 𝖠𝖵𝖠𝖨𝖫 𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲 𝖫𝖨𝖲𝖳
(𝖯𝖠𝖦𝖤 ${currentPage}/${totalPages}):\n${formattedCommands}`;

    if (endIdx < files.length) {
      helpMessage += `\n\n🗯️ 𝖳𝖮 𝖵𝖨𝖤𝖶 𝖳𝖧𝖤 𝖭𝖤𝖷𝖳 𝖯𝖠𝖦𝖤, 𝖴𝖲𝖤: 𝖧𝖤𝖫𝖯 ${currentPage + 1}`;
    }

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
