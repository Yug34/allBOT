module.exports = {
    name: "ping",
    description: "Pongs back!",
    execute(message) {
        message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp}ms\``);
    },
};
