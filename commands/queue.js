module.exports = {
  name: "queue",
  description: "Look at the current song queue",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (serverQueue === undefined) {
      return message.channel.send("Song queue is empty");
    } else {
      let songList = "```css\n";
      for (let i = 0; i < serverQueue.songs.length; i++) {
        songList += `[${i + 1}]: ${
          serverQueue.songs[i].title
        }\nDuration: ${Math.floor(serverQueue.songs[i].duration / 60)}m ${
          serverQueue.songs[i].duration % 60
        }s\n\n`;
      }
      songList += "```";

      message.channel.send(songList);
    }
  },
};
