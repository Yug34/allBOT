module.exports = {
    name: "sayd",
    description: "Urban Dictionary!",
    execute(message) {
        let splitCommand = message.content.substr(1).split(" ");
        let arguments = splitCommand.slice(1);
        let sayString = arguments.join(" ");

        message.delete();

        message.channel.send(sayString);
    },
};
