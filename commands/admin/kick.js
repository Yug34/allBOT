const { getUserFromMention } = require("../../util/getUser");

module.exports = {
    name: "kick",
    description: "Kick a member",
    execute(message, client) {
        const split = message.content.split(/ +/);
        const args = split.slice(1);

        const member = getUserFromMention(args[0], client);

        if (!member) {
            return message.reply(
                "You need to mention the member you want to kick"
            );
        }

        if (!message.member.hasPermission("MANAGE_MEMBERS")) {
            return message.reply("I can't kick this user.");
        }

        return message.guild.members
            .kick(member)
            .then(() => message.reply(`${member.username} was kickned.`))
            .catch((error) => message.reply("Sorry, an error occurred."));
    },
};
