const Typo = require("typo-js"); 
const randomWords = require("random-words");

let gameRunning = false;

class PGLong {
  constructor() {
    this.dictionary = new Typo("en_US");
    this.totalRounds = 5;
    this.numRounds = 0;
  }

  generateSubString = () => {
    let subString = "";
    
    let randomWord = null;
    while (true) {
      randomWord = randomWords();
      if (randomWord.length >= 5) break;
    }

    const randomNum = Math.floor(Math.random() * randomWord.length);
    randomNum >= randomWord.length - 3 
      ? subString = randomWord.slice(randomWord.length - 3) 
      : subString = randomWord.slice(randomNum, randomNum + 3);
    return subString;
  }

  checkIfLongest = (words) => {
    let count = 0;  // try boolean
    const checkWordLength = words[words.length - 1].length;
    for (let i = 0; i < words.length - 1; i++) {
      if (checkWordLength > words[i].length) {
        count += 1;
      }
    }

    if (count === words.length - 1) return true;
    return false;
  }

  playGame(message, players, currency) {
  
    // return the winner and total score.
    if (this.numRounds >= this.totalRounds) {
      const data = [];
      let maxScore = 0;
      let winner = null;
  
      data.push("Game Over!");

      for (let player in players) {
        if (players[player] > maxScore) {
          winner = player;
          maxScore = players[player];
        }
        
        else if (players[player] === maxScore) winner = null;
  
        data.push(
          `${JSON.parse(player).username}#${
            JSON.parse(player).discriminator
          }: ${players[player]}`,
        );
      }

      // give 100 credits to the winner   modify this part in fast
      currency.add(JSON.parse(winner).id, 100);
  
      if (!winner) data.push("No one won!");
      else {
        data.push(
          `${JSON.parse(winner).username}#${
            JSON.parse(winner).discriminator
          } won and received 100 credits!`,
        );
      }
  
      this.numRounds = 0;
      gameRunning = false;
      return message.channel.send(`\`\`\`${data.join("\n")}\`\`\``);
    }
  
    const words = [];
    let roundWinner = null;
    const subString = this.generateSubString();
    this.numRounds += 1;
    
    message.channel.send(`Type the longest word containing: \`${subString.toUpperCase()}\``);
    const msgCollector = message.channel.createMessageCollector(() => true, { time: 15000 });
  
    // collect players messages and check them.
    msgCollector.on("collect", m => {
      m.author.lastMessageChannelID = null;
      const player = JSON.stringify(m.author);
      const msg = m.content.toLowerCase();
      if (!m.author.bot 
          && player in players
          && msg.includes(subString) 
          && this.dictionary.check(msg)
        ) {
        words.push(msg);
        if (this.checkIfLongest(words)) {
          m.react("✅");
          roundWinner = player;
        }
      }
    });
  
    // start new round
    msgCollector.on("end", (collected) => {
      if (roundWinner) {
        players[roundWinner] += 1;
        console.log(roundWinner);
        message.channel.send(`\`${roundWinner} won the round.\``);
      } else message.channel.send("`Round Draw!`");

      this.playGame(message, players, currency);
    });
  }
}

module.exports = {
  name: "long", 
  description: "One who writes the longest word containing the group of three letters, wins.",
  execute(message, currency) {

    if (gameRunning) return message.channel.send("Finish the previous game first.");

    else {
      gameRunning = true;
      message.channel
        .send("```Game will start in 15 seconds. Click on the checkmark to participate. Write the longest word containing the three letters indicated to win the round.```")
        .then(message => {
          message.react("✅");
          const filter = (reaction, user) => reaction.emoji.name === "✅";
          const reactionCollector = message.createReactionCollector(filter, { time: 15000 });

          reactionCollector.on("end", collected => {
            const cache = collected.map(emoji => emoji.users.cache)[0];

            // if (cache.size <=2 ) {
            //   gameRunning = false;
            //   return message.channel.send("Need 2 or more players to start the game :(.");
            // }

            const players = {};
            cache.map(user => { 
              if (!user.bot) players[JSON.stringify(user)] = 0;
            });

            message.channel.send("Game Starts now!");
    
            // Game starts here...
            const newGame = new PGLong();
            newGame.playGame(message, players, currency);
        });
      });
    }
  }
}