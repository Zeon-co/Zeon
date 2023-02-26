exports.run = async (client, interaction) => {
  // NOTE : If you don't understand this, tell me and I will comment it too.
  await interaction.deferReply();
  const reply = await interaction.editReply("Ping?");
  await interaction.editReply(`Pong! Latency is ${reply.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
};

exports.commandData = {
  name: "ping",
  description: "Pongs when pinged.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};