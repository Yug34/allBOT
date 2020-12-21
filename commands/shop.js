module.exports = {
  name: "shop",
  description: "Look at the items in a song!",
  async execute(message, CurrencyShop) {
    const items = await CurrencyShop.findAll();
    return message.channel.send(
      items.map((item) => `${item.name}: ${item.cost}💰`).join("\n"),
      { code: true }
    );
  },
};
