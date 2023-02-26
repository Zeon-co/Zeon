const logger = require("./Logger.js");
const config = require("../config.js");
// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.

/*
  PERMISSION LEVEL FUNCTION
  This is a very basic permission system for commands which uses "levels"
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command.
  */
function permlevel(message) {
  let permlvl = 0;

  const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/*
  GUILD SETTINGS FUNCTION
  This function merges the default settings (from config.defaultSettings) with any
  guild override. If no overrides are present, the default settings are used.
*/
// TODO
/*
  SINGLE-LINE AWAIT MESSAGE
  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...
  USAGE
  const response = await awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);
*/
async function awaitReply(msg, question, limit = 60000) {
  const filter = m => m.author.id === msg.author.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}


/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// toProperCase(String) returns a proper-cased string such as: 
// toProperCase("Mary had a little lamb") returns "Mary Had A Little Lamb"
function toProperCase(string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled rejection: ${err}`);
  console.error(err);
});

module.exports = { permlevel, awaitReply, toProperCase };