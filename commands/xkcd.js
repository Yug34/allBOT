const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  name: "xkcd",
  description: "Send an xkcd comic!",
  execute(message) {
    let comicID;
    let splitCommand = message.content.substr(1).split(" ");
    let arguments = splitCommand.slice(1);

    if (arguments.length < 1) {
      comicID = Math.random() * 1000;
    } else {
      comicID = arguments[0];
    }

    let query = "https://xkcd.com/" + comicID + "/info.0.json";

    let xhr = new XMLHttpRequest();
    xhr.open("GET", query, true);
    xhr.send();

    xhr.onload = function () {
      if (this.status === 200) {
        let result = JSON.parse(this.responseText);
        message.channel.send(result.img);
      } else {
        let comics = [
          "https://imgs.xkcd.com/comics/julia_stiles.jpg",
          "https://imgs.xkcd.com/comics/five_day_forecast.png",
          "https://imgs.xkcd.com/comics/linguistics_club.png",
          "https://imgs.xkcd.com/comics/colds.png",
          "https://imgs.xkcd.com/comics/fastest_growing.png",
        ];

        let index = Math.floor(Math.random() * 5);

        message.channel.send(comics[index]);
      }
    };
  },
};
