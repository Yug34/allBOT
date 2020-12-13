module.exports = {
    name: "say",
    description: "Say something back!",
    execute(message) {
        let splitCommand = message.content.substr(1).split(" ");
        let arguments = splitCommand.slice(1);
        let sayString = arguments.join(" ");

        message.channel.send(sayString);
    },
};
