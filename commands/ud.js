const Discord = require("discord.js");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  name: "ud",
  description: "Urban Dictionary!",
  execute(message) {
    let splitCommand = message.content.substr(1).split(" ");
    let arguments = splitCommand.slice(1);
    let searchStr = "";

    if (arguments.length === 0) {
      message.channel.send("Usage: `!ud [text]`");
    } else {
      arguments.forEach((searchWord) => {
        searchStr += searchWord.toString();
        searchStr += "+";
      });
      searchStr = searchStr.slice(0, -1);

      let query = "http://api.urbandictionary.com/v0/define?term=" + searchStr;

      let xhr = new XMLHttpRequest();
      xhr.open("GET", query, true);
      xhr.send();

      xhr.onload = function () {
        if (this.status === 200) {
          let result = JSON.parse(this.responseText);

          try {
            let index = Math.floor(Math.random() * result.list.length);

            const urbanEmbed = new Discord.MessageEmbed()
              .setColor("#ff6600")
              .setTitle(result.list[index].word)
              .setURL(result.list[index].permalink)
              .addField(
                "Definition",
                result.list[index].definition.replace(/[\[\]']+/g, "")
              )
              .addField(
                "Example",
                result.list[index].example.replace(/[\[\]']+/g, "")
              )
              .setThumbnail(
                "https://i.pinimg.com/originals/f2/aa/37/f2aa3712516cfd0cf6f215301d87a7c2.jpg"
              )
              .setTimestamp();

            message.channel.send(urbanEmbed);
          } catch (error) {
            message.channel.send("`Could not find definition for that :(`");
            console.log(error);
          }
        } else {
          message.channel.send("`Something went wrong :(`");
        }
      };
    }
  },
};
