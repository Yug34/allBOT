const { Op } = require("sequelize");

module.exports = {
  name: "buy",
  description: "Buy something from the shop!",
  async execute(message, currency, CurrencyShop, Users, commandArgs) {
    const item = await CurrencyShop.findOne({
      where: { name: { [Op.like]: commandArgs } },
    });
    if (!item) return message.channel.send(`That item doesn't exist.`);
    if (item.cost > currency.getBalance(message.author.id)) {
      return message.channel.send(
        `You currently have ${currency.getBalance(
          message.author.id
        )}, but the ${item.name} costs ${item.cost}!`
      );
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    currency.add(message.author.id, -item.cost);
    await user.addItem(item);

    message.channel.send(`You've bought: ${item.name}.`);
  },
};
