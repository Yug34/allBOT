const fs = require("fs");
const Discord = require("discord.js");
const Client = require("./client/Client");
const { prefix, token } = require("./config.json");
const { welcome } = require("./util/welcomeUser");

// TODO:
// -- Add a lyrics.js command, functionality as:
//    !lyrics [input]
//    if there is no input, search and post lyrics of the current playing song
//    if there is input, filter it, find song that it refers to, post the lyrics

// TODO:
// -- Have a better system for permissions,
//    preferably a permissions property which is an [] that contains the 
//    permissions the command requires to execute.
//    If the executing user does not have any permissions mentioned in the property,
//    do not execute the command, and post a message saying so.

const { Users, CurrencyShop } = require("./dbObjects");
const currency = new Discord.Collection();

const client = new Client();
client.commands = new Discord.Collection();
client.once("ready", async () => {
  const storedBalances = await Users.findAll();
  storedBalances.forEach((b) => currency.set(b.user_id, b));

  client.user.setActivity("over y'all", { type: "WATCHING" });
  console.log("Bot Online.");
});


// get files from the subdirectories of the commands folder
const getDirectories = fs
  .readdirSync("./commands", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

// get files immediately in the commands folder
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

// import the command files
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// import command files in the sub directories
for (const directory of getDirectories) {
  const commandFiles = fs
    .readdirSync(`./commands/${directory}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${directory}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.on("reconnecting", () => {
  console.log("Reconnecting!");
});

client.on("disconnect", () => {
  console.log("Disconnect!");
});

// Barry Allen!
client.on("channelCreate", (channel) => {
  channel.send("First!");
});

client.on("guildMemberAdd", async (member) => {
  await welcome(member);
});

Reflect.defineProperty(currency, "add", {
  value: async function add(id, amount) {
    const user = currency.get(id);
    if (user) {
      user.balance += Number(amount);
      return user.save();
    }
    const newUser = await Users.create({ user_id: id, balance: amount });
    currency.set(id, newUser);
    return newUser;
  },
});

Reflect.defineProperty(currency, "getBalance", {
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

client.on("message", async (message) => {
  // // To test welcomeUser.js:
  // if (message.content === '!join') {
  //   client.emit('guildMemberAdd', message.member);
  //   return;
  // }

  const input = message.content.slice(prefix.length).trim();
  if (!input.length) return;

  // Discard the first value, store the next 2
  const [, commandName, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

  const command = client.commands.get(commandName);

  // Do not process messages by the bot, or any other bots.
  if (message.author.bot) return;

  // Add 5$ to user's account when they send a message.
  currency.add(message.author.id, 5);

  if (!message.content.startsWith(prefix)) return;
  
  // I know I know, will be neater soon!
  try {
    if (commandName === "ban" || commandName === "userinfo") {
      command.execute(message, client);
    } else if (commandName === "balance" || commandName === "fast") {
      command.execute(message, currency);
    } else if (commandName === "inventory") {
      command.execute(message, Users);
    } else if (commandName === "transfer") {
      command.execute(message, currency, commandArgs);
    } else if (commandName === "buy") {
      command.execute(message, currency, CurrencyShop, Users, commandArgs);
    } else if (commandName === "shop") {
      command.execute(message, CurrencyShop);
    } else if (commandName === "leaderboard") {
      command.execute(message, currency, client);
    } else {
      command.execute(message);
    }
    console.log("Command: " + commandName + " Args: " + commandArgs);
  } catch (error) {
    console.log("Command: " + commandName + " Args: " + commandArgs);
    console.error(error);
    message.reply("There was an error trying to execute that command!");
  }
});

client.login(token);
