module.exports = {
  name: "balance",
  description: "Check your balance!",
  execute(message, currency) {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(
      `${target.tag} has ${currency.getBalance(target.id)}💰`
    );
  },
};
