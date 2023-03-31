const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('shows first 10 songs in the queue'),

  execute: async ({ client, interaction }) => {
    const queue = client.player.nodes.get(interaction.guildId);

    // check if there are songs in the queue
    if (!queue || !queue.node.isPlaying()) {
      await interaction.reply('There are no songs in the queue');
      return;
    }

    // Get the first 10 songs in the queue
    const queueString = queue.tracks.toArray().slice(0, 10).join('\n');

    // Get the current song
    const currentSong = queue.currentTrack;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**Currently Playing**\n` +
              (currentSong ? `${currentSong.title}` : 'None') +
              `\n\n**Queue**\n${queueString}`,
          )
          .setThumbnail(currentSong.setThumbnail),
      ],
    });
  },
};
