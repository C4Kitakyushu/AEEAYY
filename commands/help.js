const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'show available commands',
  author: 'System',
  execute(senderId, args, pageAccessToken, sendMessage) {
    const commandsDir = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map(file => {
      const command = require(path.join(commandsDir, file));
      return `➜ ${command.name}\n ➜ ${command.description}\n ➜ 𝗰𝗿𝗲𝗱𝗶𝘁: ${command.author}`;
    });

    const totalCommands = commandFiles.length;
    const helpMessage = `𝗠𝗜𝗚𝗢 𝗔𝗜 𝗖𝗠𝗗 𝗟𝗜𝗦𝗧:\n➜𝘁𝗼𝘁𝗮𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${totalCommands} \n\n${commands.join('\n\n')}`;
    
    sendMessage(senderId, { text: helpMessage }, pageAccessToken);
  }
};