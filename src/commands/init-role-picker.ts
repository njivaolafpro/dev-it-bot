import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, TextBasedChannel } from 'discord.js';
import { PICKABLE_ROLES, CHANNEL_IDS } from '../common';

export default {
    data: new SlashCommandBuilder()
        .setName("init-role-picker")
        .setDescription("Initialize announcement in role picker.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: CommandInteraction) {
        const { options, member, client } = interaction;

        const channelId = CHANNEL_IDS.ROLES;

        const channel = (await client.channels.fetch(channelId)) as TextBasedChannel | null;
        if (!channel) {
            await interaction.reply({ content: 'That channel does not exist!', ephemeral: true });
            return;
        }

        const emojis = PICKABLE_ROLES.map(r => r.emojiRequirement);

        const message = [...PICKABLE_ROLES].map(e => `${e.emojiRequirement} ${e.name}`).join('   |   ');

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Système de role-picking`)
            .addFields(
                { name: "Hey hello les gars ;) Vous pouvez enfin prendre vos rôles ^^", value: message },
            );

        const sentMessage = await channel.send({ embeds: [embed] });

        emojis.forEach(e => sentMessage.react(e));
        await interaction.reply({ content: 'done initialization of role picker' })
        return;
    }
}
