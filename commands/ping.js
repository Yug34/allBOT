module.exports = {
    name: "ping",
    description: "S!",
    execute(message) {
        message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp}ms\``);
    },
};
