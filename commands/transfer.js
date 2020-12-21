module.exports = {
  name: "transfer",
  description: "Give $$$ to another user!",
  execute(message, currency, commandArgs) {
    const currentAmount = currency.getBalance(message.author.id);
    const transferAmount = commandArgs
      .split(/ +/g)
      .find((arg) => !/<@!?\d+>/g.test(arg));
    const transferTarget = message.mentions.users.first();

    if (!transferAmount || isNaN(transferAmount))
      return message.channel.send(
        `Sorry ${message.author}, that's an invalid amount.`
      );
    if (transferAmount > currentAmount)
      return message.channel.send(
        `Sorry ${message.author}, you only have ${currentAmount}.`
      );
    if (transferAmount <= 0)
      return message.channel.send(
        `Please enter an amount greater than zero, ${message.author}.`
      );

    currency.add(message.author.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);

    return message.channel.send(
      `Successfully transferred ${transferAmount}💰 to ${
        transferTarget.tag
      }. Your current balance is ${currency.getBalance(message.author.id)}💰`
    );
  },
};
