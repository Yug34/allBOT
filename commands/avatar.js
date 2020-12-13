const Discord = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Send an embed of avatar!",
  execute(message) {
    if (message.content === "!avatar") {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setTitle(message.author.username)
        .setImage(message.author.displayAvatarURL())
        .setTimestamp();

      message.channel.send(avatarEmbed);
    } else if (message.mentions.users) {
      message.mentions.users.forEach((user) => {
        const avatarEmbed = new Discord.MessageEmbed()
          .setColor("#00ff00")
          .setTitle(user.username)
          .setImage(user.displayAvatarURL())
          .setTimestamp();

        message.channel.send(avatarEmbed);
      });
    }
  },
};
