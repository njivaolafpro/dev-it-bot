import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('une description ici!'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Salut je suis la première commande du Dev-It-Bot full typescript :) !');
    }
}
