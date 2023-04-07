const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('shuffles the queue'),

    execute: async ({ client, interaction }) => {
        const queue = client.player.nodes.get(interaction.guildId);

        // check if there are songs in the queue
        if (!queue || !queue.node.isPlaying()) {
            await interaction.reply('There are no songs in the queue!');
            return;
        }

        // shuffle the queue list
        queue.shuffle();

        // Get the first 10 songs in the queue
        const queueString = queue.tracks.toArray().slice(0, 10).join('\n');

        // Get the current song
        const currentSong = queue.currentTrack;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `Shuffled the queue!\n\n**Currently Playing**\n` +
                        (currentSong ? `${currentSong.title}` : 'None') +
                        `\n\n**Queue**\n${queueString}`,
                    )
                    .setThumbnail(currentSong.setThumbnail),
            ],
        });
    },
};