const Discord = require("discord.js");
const ytSearch = require("youtube-search");
const ytdl = require("ytdl-core");

const options = {
  maxResults: 10,
  key: "AIzaSyDHKq-FL_t5Ldc4sX4fT7XqkY5PvhWi-KE",
};

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      args.shift(); //remove the primarycommand
      let query = "";
      args.forEach((word) => {
        query += word.toString();
        query += " ";
      });
      query = query.slice(0, -1);

      let selectedVideo;
      await new Promise((resolve, reject) => {
        ytSearch(query, options, function (err, results) {
          if (err) {
            console.log(err);
            return;
          }
          for (let i = 0; i < results.length; i++) {
            if (results[i].kind === "youtube#video") {
              selectedVideo = results[i];
              break;
            }
          }
          resolve();
        });
      });

      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

      const songInfo = await ytdl.getInfo(selectedVideo.link);
      const song = {
        duration: songInfo.videoDetails.lengthSeconds,
        messageAuthor: message.author.username,
        authorPhoto: message.author.displayAvatarURL(),
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        description: selectedVideo.description,
        image: selectedVideo.thumbnails.high.url,
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true,
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          queueContruct.connection = await voiceChannel.join();
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        const songEmbed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setTitle(song.title.toString().replace(/&quot;/g, '\\"'))
            .setDescription(song.description)
            .setURL(song.url)
            .setAuthor(
                song.messageAuthor,
                song.authorPhoto
            )
            .setImage(song.image)
            .setTimestamp();

        serverQueue.songs.push(song);
        return message.channel.send(songEmbed);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const songEmbed = new Discord.MessageEmbed()
      .setColor("#00ff00")
      .setTitle(song.title.toString().replace(/&quot;/g, '\\"'))
      .setDescription(song.description)
      .setURL(song.url)
      .setAuthor(
        song.messageAuthor,
        song.authorPhoto
      )
      .setImage(song.image)
      .setTimestamp();

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(songEmbed);
  },
};
