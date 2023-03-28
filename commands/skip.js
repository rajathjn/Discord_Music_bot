const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song'),

  execute: async ({ client, interaction }) => {
    // Get the queue for the server
    const queue = client.player.nodes.get(interaction.guildId);

    // If there is no queue, return
    if (!queue) {
      await interaction.reply('There are no songs in the queue');
      return;
    }

    // Skip the current song
    queue.node.skip();

    // Return an embed to the user saying the song has been skipped
    let filename = Math.floor(Math.random() * 10);
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Song has been skipped!")
          .setThumbnail(`attachment://${filename}.png`),
      ],
      files: [
        new AttachmentBuilder(`./images/${filename}.png`)
      ]
    });
  },
};
