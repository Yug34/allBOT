const fs = require("fs");

module.exports = {
  name: "help",
  description: "List all available commands.",
  execute(message) {
    let str = "```css\n";

    const getDirectories = fs
      .readdirSync("./commands", { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const directory of getDirectories) {
      str += `#${directory}: {\n`;
      const commandFiles = fs
        .readdirSync(`./commands/${directory}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`./${directory}/${file}`);
        str += command.name + " - " + command.description + "\n";
      }
      str += `}\n`;
    }

    str += "#Other #Commands: {\n";
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    str += "";
    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += command.name + " - " + command.description + "\n";
    }
    str += `}\n`;

    str += "```";

    message.channel.send(str);
  },
};
