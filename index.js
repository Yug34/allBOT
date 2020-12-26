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

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
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

const Canvas = require('canvas');

const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    ctx.font = `${fontSize -= 10}px sans-serif`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (ctx.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return ctx.font;
};

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./images/wallpaper.jpg');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Welcome to ${member.guild.name},`, canvas.width / 2.5, canvas.height / 3.5);

  // Add an exclamation point here and below
  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

  channel.send(`Welcome to the server, ${member}!`, attachment);
});


client.on("message", async (message) => {
  // const args = message.content.slice(prefix.length).split(/ +/);
  // const commandName = args.shift().toLowerCase();
  if (message.content === '!join') {
    client.emit('guildMemberAdd', message.member);
    return;
  }

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
