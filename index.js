// Check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x or higher is required. Update Node on your system.");
require("dotenv").config();

// Load up the discord.js library
const path = require('node:path')
const fs = require('node:fs');
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { readdirSync } = require("fs");
const { intents, partials, permLevels } = require("./config.js");
const logger = require("./modules/Logger.js");
// This is our Client, also called "bot" or "self"
const client = new Client({ intents, partials });

// Aliases, commands and slash commands are put in collections where they can be
// read from, catalogued, listed, etc.
const commands = new Collection();
const aliases = new Collection();
const slashcmds = new Collection();

client.commands = commands;
// Generate a cache of client permissions for pretty perm names in commands.
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
  const thisLevel = permLevels[i];
  levelCache[thisLevel.name] = thisLevel.level;
}

// To reduce client pollution we'll create a single container property
// that we can attach everything we need to.
client.container = {
    commands,
    aliases,
    slashcmds,
    levelCache
  };

  // node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {
 // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.


  // NOTE : If you don't understand this, tell me and I will comment it too.
  const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
  logger.log(`Loading Command: ${command.help.name}. 👌`, "log");
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
   // Now we load any **slash** commands you may have in the ./slash directory.

     // NOTE : If you don't understand this, tell me and I will comment it too.
   const slashFiles = readdirSync("./slash").filter(file => file.endsWith(".js"));
   for (const file of slashFiles) {
     const command = require(`./slash/${file}`);
     const commandName = file.split(".")[0];
     logger.log(`Loading Slash command: ${commandName}. 👌`, "log");
     
     // Now set the name of the command with it's properties.
     client.container.slashcmds.set(command.commandData.name, command);
   }

   // Then we load events, which will include our message and ready event.

     // NOTE : If you don't understand this, tell me and I will comment it too.
     const eventFiles = readdirSync("./events/").filter(file => file.endsWith(".js"));
     const eventsPath = path.join(__dirname, 'events');
     for (const file of eventFiles) {
       const filePath = path.join(eventsPath, file);
       const event = require(filePath);
       logger.log(`Loading Event: ${event.name}. 👌`, "log");
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }

  // Threads are currently in BETA.
  // This event will fire when a thread is created, if you want to expand
  // the logic, throw this in it's own event file like the rest.

  // TO DO : Work with thread for announcement-fork.
  client.on("threadCreate", (thread) => thread.join());

  // Here we login the client.
  client.login(process.env.BUILD == "TEST" ? process.env.TOKEN_TEST : process.env.DISCORD_TOKEN);

// End top-level async/await function.
};

init();