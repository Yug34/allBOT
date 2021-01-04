module.exports = {
  name: "sayd",
  description: "Make the bot say something  and delete the original message!",
  execute(message) {
    let splitCommand = message.content.substr(1).split(" ");
    let arguments = splitCommand.slice(1);
    let sayString = arguments.join(" ");

    message.delete();

    message.channel.send(sayString);
  },
};
