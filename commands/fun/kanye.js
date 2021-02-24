const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
  name: "kanye",
  description: "I am the worlds f#$%ing greatest living rockstar!",
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
          "Burn that excel spread sheet.",
          "Let's be like water.",
          "I channel Will Ferrell when I'm at the daddy daughter dances.",
          "My dad got me a drone for Christmas",
          "I give up drinking every week.",
          "I hate when I'm on a flight and I wake up with a water bottle next to me like oh great now I gotta be responsible for this water bottle",
        ];

        let index = Math.floor(Math.random() * 5);

        message.channel.send(quote[index]);
      }
    };
  },
};
