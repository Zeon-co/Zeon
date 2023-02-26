const logger = require("../modules/Logger.js");

module.exports = async client => {
  // Log that the bot is online.
  logger.log(`${client.user.tag}, ready to serve ${client.guilds.cache.map(g => g.memberCount)}`);
  
  // Make the bot "play the game" which is the help command with default prefix.
  client.user.setActivity('salut');
};