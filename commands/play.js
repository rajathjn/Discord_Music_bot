const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('play a song from YouTube.')

    .addSubcommand((subcommand) =>
      subcommand
        .setName('search')
        .setDescription('Searches for a song and plays it')
        .addStringOption((option) =>
          option
            .setName('searchterms')
            .setDescription('search keywords')
            .setRequired(true),
        ),
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName('song')
        .setDescription('Play the song from spotify')
        .addStringOption((option) =>
          option
            .setName('url')
            .setDescription("the song's url")
            .setRequired(true),
        ),
    ),

  execute: async ({ client, interaction }) => {
    // Make sure the user is inside a voice channel
    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'You need to be in a Voice Channel to play a song.',
        ephemeral: true,
      });
    }
    // Create a play queue for the server
    const queue = await client.player.nodes.create(interaction.guildId);
    // Wait until you are connected to the channel
    if (!queue.connection) {
      await queue.connect(interaction.member.voice.channel);
    }

    if (interaction.options.getSubcommand() === 'search') {
      // Search for the song using the discord-player
      let url = interaction.options.getString('searchterms');
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      // finish if no tracks were found
      if (result.tracks.length === 0) return interaction.reply('No results');

      // Add the track to the queue
      const song = result.tracks[0];
      await queue.addTrack(song);
    }

    if (interaction.options.getSubcommand() === 'song') {
      let url = interaction.options.getString('url');
      // Search for the song using the discord-player
      const result = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.SPOTIFY_TRACK, //YOUTUBE_VIDEO
      });

      // finish if no tracks were found
      if (result.tracks.length === 0) return interaction.reply('No results');

      // Add each track to the queue
      const song = result.tracks;
      await queue.addTrack(song);
    }
    // Play the song
    if (!queue.node.isPlaying()) {
      await queue.node.play();
    }

    await interaction.reply({
      content: 'Added to queue',
      ephemeral: true,
      embeds: [],
    });
  },
};
