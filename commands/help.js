const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'show available commands',
  author: 'developer',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file !== 'help.js');

    if (args[0] && isNaN(args[0])) {
      const commandName = args[0].toLowerCase() + '.js';
      const commandFile = commandFiles.find(file => file.toLowerCase() === commandName);

      if (commandFile) {
        const command = require(path.join(commandsDir, commandFile));
        const guide = command.config?.guide?.en || "No guide available.";
        const guideMessage = `Guide for ${command.name}:\n${guide.replace(/\{pn\}/g, config.prefix)}`;
        return sendMessage(senderId, { text: guideMessage }, pageAccessToken);
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
    const pageFiles = commandFiles.slice(startIdx, endIdx);

    if (pageFiles.length === 0) {
      return sendMessage(senderId, { text: 'No commands to display on this page.' }, pageAccessToken);
    }

    const commands = pageFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `➜ ${command.name}\n ➜ ${command.description}\n ➜ 𝗰𝗿𝗲𝗱𝗶𝘁: ${command.author}`;
    });

    const totalPages = Math.ceil(commandFiles.length / pageSize);
    const helpMessage = `𝗠𝗜𝗚𝗢 𝗔𝗜 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧:\n➜ 𝘁𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commandFiles.length} \n\n${commands.join('\n\n')}`;

    if (endIdx < commandFiles.length) {
      helpMessage += `\n\n🗯️ 𝖳𝖮 𝖵𝖨𝖤𝖶 𝖳𝖧𝖤 𝖭𝖤𝖷𝖳 𝖯𝖠𝖦𝖤, 𝖴𝖲𝖤: 𝖧𝖤𝖫𝖯 ${pageIndex + 1}`;
    }

    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};
