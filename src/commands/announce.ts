import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

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
        const channel = options.get("channel")?.value as string | undefined;
        console.log('ANNOUNCING IN CHANNEL ->', channel);
        if (!title || !message) {
            console.warn('Missing data');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Annonce de ${member}`)
            .addFields(
                { name: "Titre", value: title },
                { name: "Message", value: message },
            )


        await interaction.reply('Salut salut je suis la première commande du Dev-It-Bot full typescript :) !');
    }
}
