const { ApplicationCommandType, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    name: 'suggestions',
    description: '(💡) Utils',
    type: ApplicationCommandType.ChatInput,
execute: async (client, interaction, args, con) => {
    const modal = new ModalBuilder()
        .setCustomId('suggestion')
        .setTitle("Publier une suggestion :"
    )

    const row_0 = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId('ask_0')
        .setLabel("Le titre de votre suggestion")
        .setMaxLength(256)
        .setStyle(TextInputStyle.Short)
    )

    const row_1 = new ActionRowBuilder()
    .addComponents(
        new TextInputBuilder()
        .setCustomId('ask_1')
        .setLabel("La description de votre suggestion")
        .setMaxLength(1024)
        .setStyle(TextInputStyle.Paragraph)
    )

    modal.addComponents(row_0, row_1);
    await interaction.showModal(modal);
    }
}