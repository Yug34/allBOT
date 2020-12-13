module.exports = {
    name: "sayd",
    description: "Say something back and delete the original message!",
    execute(message) {
        let splitCommand = message.content.substr(1).split(" ");
        let arguments = splitCommand.slice(1);
        let sayString = arguments.join(" ");

        message.delete();

        message.channel.send(sayString);
    },
};
