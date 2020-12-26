const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  name: "kanye",
  description: "I am the world's f#$%ing greatest living rockstar!",
  execute(message) {
    let query = "https://api.kanye.rest/";
    let xhr = new XMLHttpRequest();
    xhr.open("GET", query, true);
    xhr.send();

    xhr.onload = function () {
      if (this.status === 200) {
        let result = JSON.parse(this.responseText);
        message.channel.send(result.quote);
      } else {
        let quote = [
          "Let's be like water.",
          "If I don't scream, if I don't say something then no one's going to say anything.",
          "Tweeting is legal and also therapeutic.",
          "I give up drinking every week.",
          "I'll say things that are serious and put them in a joke form so people can enjoy them. We laugh to keep from crying.",
        ];

        let index = Math.floor(Math.random() * 5);

        message.channel.send(quote[index]);
      }
    };
  },
};
