const fs = require("fs");
const Discord = require("discord.js");
const Client = require("./client/Client");
const { prefix, token } = require("./config.json");

// TODO:
// - Also add Lyrics
// - Image manipulation using canvas for !userinfo, their level and all

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

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

Reflect.defineProperty(currency, "add", {
  /* eslint-disable-next-line func-name-matching */
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
  /* eslint-disable-next-line func-name-matching */
  value: function getBalance(id) {
    const user = currency.get(id);
    return user ? user.balance : 0;
  },
});

client.on("message", async (message) => {
  // const args = message.content.slice(prefix.length).split(/ +/);
  // const commandName = args.shift().toLowerCase();
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