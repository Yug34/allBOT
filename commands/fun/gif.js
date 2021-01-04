const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const gyfcat_key = require("../../config.json").gyfcat_key;

module.exports = {
  name: "gif",
  description: "Sends a gif of the text arguments",
  execute(message) {
    let splitCommand = message.content.substr(1).split(" ");
    let arguments = splitCommand.slice(1);

    if (arguments.length < 1) {
      message.channel.send("`Usage: !gif [text]`");
    } else {
      let searchStr = "";
      arguments.forEach((word) => {
        searchStr += word.toString();
        searchStr += "+";
      });
      searchStr.slice(0, -1);

      let query =
        "http://api.giphy.com/v1/gifs/search?q=" +
        searchStr +
        "&api_key=" +
        gyfcat_key +
        "&limit=1";

      let xhr = new XMLHttpRequest();
      xhr.open("GET", query, true);
      xhr.send();

      xhr.onload = function () {
        if (this.status === 200) {
          let result = JSON.parse(this.responseText);

          try {
            message.channel.send(result.data[0].embed_url);
          } catch (error) {
            let gifs404 = [
              "https://giphy.com/embed/H7wajFPnZGdRWaQeu0",
              "https://giphy.com/embed/14uQ3cOFteDaU",
              "https://giphy.com/embed/8L0Pky6C83SzkzU55a",
              "https://giphy.com/embed/11gZBGuDnYwdpu",
            ];

            let index = Math.floor(Math.random() * 4);

            message.channel.send(gifs404[index]);
          }
        } else {
          let gifs404 = [
            "https://giphy.com/embed/H7wajFPnZGdRWaQeu0",
            "https://giphy.com/embed/14uQ3cOFteDaU",
            "https://giphy.com/embed/8L0Pky6C83SzkzU55a",
            "https://giphy.com/embed/11gZBGuDnYwdpu",
          ];

          let index = Math.floor(Math.random() * 4);

          message.channel.send(gifs404[index]);
        }
      };
    }
  },
};
