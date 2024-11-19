const { ApplicationCommandType, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    name: 'project',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const modal = new ModalBuilder()
                .setCustomId('create-project')
                .setTitle("Créez un nouveau projet")

                const row_0 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId('title')
                    .setLabel("Le nom de votre projet")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                )

                const row_1 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel("Decrivez votre projet")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                )

                const row_2 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId('link')
                    .setLabel("Lien de votre projet")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                )

                const row_3 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                    .setCustomId('github')
                    .setLabel("Lien de votre projet github")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                )

        modal.addComponents(row_0, row_1, row_2, row_3);
		await interaction.showModal(modal);
    }
}