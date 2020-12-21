const fs = require("fs");

module.exports = {
  name: "help",
  description: "List all available commands.",
  execute(message) {
    let str = "```css\n";
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      // str += `Name: ${command.name}, Description: ${command.description} \n`;
      str += command.name + " - " + command.description + "\n"
    }
    str += "```";

    message.channel.send(str);
  },
};
