import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, TextBasedChannel } from 'discord.js';
import { PICKABLE_ROLES } from '../common';

const ROLE_CHANNEL_ID = '1047640961901154304';

export default {
    data: new SlashCommandBuilder()
        .setName("init-role-picker")
        .setDescription("Initialize announcement in role picker.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: CommandInteraction) {
        const { options, member, client } = interaction;
        
        const channelId = ROLE_CHANNEL_ID;

        const channel = (await client.channels.fetch(channelId)) as TextBasedChannel | null;
        if (!channel) {
            await interaction.reply({ content: 'That channel does not exist!', ephemeral: true });
            return;
        }


        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Système de role-picking`)
            .addFields(
                { name: "Message", value: `Go go go cliquer sur les réactions avec lequelles vous pouvez avoir votre rôle :)` },
            )
        const sentMessage = await channel.send({ embeds: [embed] });
        PICKABLE_ROLES.forEach(r=> sentMessage.react(r.emojiRequirement));
        
    }
}
