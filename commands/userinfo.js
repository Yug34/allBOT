const Discord = require("discord.js");
const { getUserFromMention } = require("../util/getUser");

module.exports = {
  name: "userinfo",
  description: "Get information about a user.",
  execute(message, client) {
    const split = message.content.split(/ +/);
    const args = split.slice(1);

    if (args.length === 0) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle(message.author.username)
        .setImage(message.author.displayAvatarURL())
        .setTimestamp()
        .addField("ID", message.author.id);

      message.channel.send(avatarEmbed);
    }
    else {
      const user = getUserFromMention(args[0], client);
      const avatarEmbed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setTitle(user.username)
          .setImage(user.displayAvatarURL())
          .setTimestamp()
          .addField("ID", user.id);

      message.channel.send(avatarEmbed);
    }
  },
};
