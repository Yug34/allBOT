// Author: https://github.com/PratikAwaik

const Typo = require("typo-js");
const randomWords = require("random-words");

let gameRunning = false;

class PGFast {
  constructor() {
    this.dictionary = new Typo("en_US");
    this.totalRounds = 5;
    this.numRounds = 0;
  }

  generateSubString = () => {
    let subString = "";
    const randomWord = randomWords({ min: 5, max: 10, exactly: 1 })[0];
    const randomNum = Math.floor(Math.random() * randomWord.length);
    randomNum >= randomWord.length - 3
        ? (subString = randomWord.slice(randomWord.length - 3))
        : (subString = randomWord.slice(randomNum, randomNum + 3));
    return subString;
  };

  playGame(message, players) {
    // return the winner and total score.
    if (this.numRounds >= this.totalRounds) {
      const data = [];
      let maxScore = 0;
      let winner = null;

      data.push("Game Over!");
      for (let player of Object.keys(players)) {
        if (players[player] > maxScore) {
          winner = player;
          maxScore = players[player];
        }
        data.push(`${player}: ${players[player]}`);
      }

      if (!winner) data.push("No one won!");
      else data.push(`Winner is ${winner}`);

      this.numRounds = 0;
      gameRunning = false;
      return message.channel.send(`\`\`\`${data.join("\n")}\`\`\``);
    }

    let firstValidWord = false;
    const subString = this.generateSubString();
    this.numRounds += 1;

    message.channel.send(`Quickly type a word containing: \`${subString.toUpperCase()}\``
    );
    const msgCollector = message.channel.createMessageCollector(() => true, {
      time: 10000,
    });

    // collect players messages and check them.
    msgCollector.on("collect", (m) => {
      const tag = `${m.author.username}#${m.author.discriminator}`;
      const msg = m.content.toLowerCase();
      if (
          !m.author.bot &&
          Object.keys(players).includes(tag) &&
          !firstValidWord &&
          msg.includes(subString) &&
          this.dictionary.check(msg)
      ) {
        m.react("✅");
        players[tag] += 1;
        firstValidWord = true;
      }
    });

    // start new round
    msgCollector.on("end", (collected) => {
      this.playGame(message, players);
    });
  }
}

module.exports = {
  name: "fast",
  description: "One who writes the word containing the group of three letters, wins.",
  execute(message) {
    if (gameRunning)
      return message.channel.send("Finish the previous game first.");
    else {
      gameRunning = true;
      message.channel
          .send(
              "```Game will start in 15 seconds. Click on the checkmark to participate. Be the fastest to write a word containing the group of 3 letters indicated.```"
          )
          .then((message) => {
            message.react("✅");
            const filter = (reaction, user) => reaction.emoji.name === "✅";
            const reactionCollector = message.createReactionCollector(filter, {time: 15000});

            reactionCollector.on("end", (collected) => {
              const cache = collected.map((emoji) => emoji.users.cache)[0];

              if (cache.size <= 2) {
                gameRunning = false;
                return message.channel.send(
                    "Need 2 or more players to start the game :(."
                );
              }

              const players = {};
              cache.map((user) => {
                if (!user.bot) players[user.tag] = 0;
              });

              message.channel.send("Game Starts now!");

              // Game starts here...
              const newGame = new PGFast();
              newGame.playGame(message, players);
            });
          });
    }
  },
};
