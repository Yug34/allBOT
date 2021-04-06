const Discord = require("discord.js");

module.exports = {
  name: "bubblewrap",
  description: "Pop the bubbles!",
  execute(message, args) {
    const COUNT = 10;
    const data = [];

    for (let i = 0; i < COUNT; i++) {
      const row = [];
      for (let j = 0; j < COUNT; j++) {
        row.push("||POP||");
      }
      data.push(row.join(""));
    }

    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .addField("Pop deez bubbles", data);
    message.channel.send(embed);
  },
};
