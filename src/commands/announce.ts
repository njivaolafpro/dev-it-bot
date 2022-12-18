import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, TextBasedChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Announce something.")
        .addStringOption(option =>
            option.setName("title")
                .setDescription("Name your announcement.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("message")
                .setDescription("Describe your announcement.")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to echo to.')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: CommandInteraction) {
        const { options, member, client } = interaction;
        const title = options.get("title")?.value as string | undefined;
        const message = options.get("message")?.value as string | undefined;
        const channelId = options.get("channel")?.value as string | undefined;

        if (!title || !message || !channelId) {
            await interaction.reply({ content: 'Please make sure that all parameters are sent!', ephemeral: true });
            console.warn('Missing data');
            return;
        }

        const channel = (await client.channels.fetch(channelId)) as TextBasedChannel | null;
        if (!channel) {
            await interaction.reply({ content: 'That channel does not exist!', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Annonce de ${member}`)
            .addFields(
                { name: "Titre", value: title },
                { name: "Message", value: message },
            )
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'done announcement'});
        return;
    }
}
