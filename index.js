const fs = require("fs");
const Discord = require("discord.js");
const Client = require("./client/Client");
const { prefix, token } = require("./config.json");
const { welcome } = require("./util/welcomeUser");

// TODO:
// - Also add Lyrics

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

const getDirectories = fs
  .readdirSync("./commands", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

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

client.on("channelCreate", (channel) => {
  channel.send("First!");
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

client.on("guildMemberAdd", async (member) => {
  await welcome(member);
});

client.on("message", async (message) => {
  // To test welcomeUser.js:
  // if (message.content === '!join') {
  //   client.emit('guildMemberAdd', message.member);
  //   return;
  // }

  const input = message.content.slice(prefix.length).trim();
  if (!input.length) return;

  const [, commandName, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

  const command = client.commands.get(commandName);

  if (message.author.bot) return;

  currency.add(message.author.id, 5);

  if (!message.content.startsWith(prefix)) return;

  try {
    if (commandName === "ban" || commandName === "userinfo") {
      command.execute(message, client);
    } else if (commandName === "balance") {
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
